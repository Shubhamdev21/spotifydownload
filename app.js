document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // State Variables
  const apiKey = '66485b34e8msh519020444ce23fep16d523jsn9e13e28bca91';
  let downloadHistory = JSON.parse(localStorage.getItem('spoti_download_history')) || [];
  let isDownloading = false;

  // DOM Elements
  const spotifyUrlInput = document.getElementById('spotifyUrl');
  const dropBtn = document.getElementById('dropBtn');
  const btnText = document.getElementById('btnText');
  const btnIcon = document.getElementById('btnIcon');
  const btnSpinner = document.getElementById('btnSpinner');

  const skeletonLoader = document.getElementById('skeletonLoader');
  const trackResult = document.getElementById('trackResult');
  const trackCard = document.getElementById('trackCard');
  const albumArt = document.getElementById('albumArt');
  const trackTitle = document.getElementById('trackTitle');
  const trackArtist = document.getElementById('trackArtist');
  const trackMeta = document.getElementById('trackMeta');

  const downloadBtn = document.getElementById('downloadBtn');
  const circleProgressContainer = document.getElementById('circleProgressContainer');
  const circleProgressPercent = document.getElementById('circleProgressPercent');
  const circleElement = document.querySelector('.progress-ring__circle');

  // Sidebar elements
  const queueCard = document.getElementById('queueCard');
  const queueContainer = document.getElementById('queueContainer');
  const libraryScroller = document.getElementById('libraryScroller');
  const emptyHistory = document.getElementById('emptyHistory');

  const toastContainer = document.getElementById('toastContainer');

  // Circular progress configuration
  const radius = circleElement.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  circleElement.style.strokeDasharray = `${circumference} ${circumference}`;
  circleElement.style.strokeDashoffset = circumference;

  let activeTrackData = null; // Store fetched track details

  // Initialization
  updateLibraryUI();

  // Event Listeners
  dropBtn.addEventListener('click', handleDropTrack);
  downloadBtn.addEventListener('click', startPremiumDownload);

  // Toast Alerts system
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    const iconName = type === 'error' ? 'alert-triangle' : 'info';
    toast.innerHTML = `
      <i data-lucide="${iconName}" style="width: 18px; height: 18px;"></i>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    lucide.createIcons({ attrs: { class: 'lucide' } });

    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => { toast.remove(); });
    }, 3500);
  }

  // Formatter Duration
  function formatDuration(duration) {
    if (!duration) return 'N/A';
    let seconds = Math.floor(duration > 10000 ? duration / 1000 : duration);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function isValidSpotifyUrl(url) {
    return /^(https?:\/\/)?(open\.spotify\.com\/track\/)([a-zA-Z0-9]+)(\?.*)?$/.test(url.trim());
  }

  // Fetch track meta
  async function handleDropTrack() {
    const url = spotifyUrlInput.value.trim();

    if (!url || !isValidSpotifyUrl(url)) {
      showToast('Please paste a valid Spotify track link', 'error');
      spotifyUrlInput.classList.add('invalid');
      return;
    }

    spotifyUrlInput.classList.remove('invalid');

    setLoading(true);

    try {
      const response = await fetch(`https://spotify-downloader9.p.rapidapi.com/downloadSong?songId=${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com',
          'x-rapidapi-key': apiKey
        }
      });

      if (!response.ok) {
        throw new Error('Failed to query the Spotify Downloader API.');
      }

      const data = await response.json();

      if (data.success === false || !data.data || !data.data.downloadLink) {
        throw new Error(data.message || 'Unable to retrieve download link for this track.');
      }

      activeTrackData = data.data;
      displayTrackResult(activeTrackData);
      showToast('Track processed successfully!');
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Something went wrong while downloading.', 'error');
      trackResult.style.display = 'none';
    } finally {
      setLoading(false);
    }
  }

  function setLoading(isLoading) {
    if (isLoading) {
      btnSpinner.style.display = 'inline-block';
      btnIcon.style.display = 'none';
      btnText.textContent = 'Dropping...';
      dropBtn.disabled = true;
      trackResult.style.display = 'none';
      skeletonLoader.style.display = 'block';
    } else {
      btnSpinner.style.display = 'none';
      btnIcon.style.display = 'inline-block';
      btnText.textContent = 'Drop Track';
      dropBtn.disabled = false;
      skeletonLoader.style.display = 'none';
    }
  }

  function displayTrackResult(trackInfo) {
    trackTitle.textContent = trackInfo.title || 'Unknown Track';
    trackArtist.textContent = trackInfo.artist || 'Unknown Artist';
    albumArt.src = trackInfo.cover || 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=200&auto=format&fit=crop';
    trackMeta.textContent = trackInfo.duration ? `Duration: ${formatDuration(trackInfo.duration)}` : 'Duration: N/A';

    // Reset button states
    downloadBtn.style.display = 'flex';
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = '<i data-lucide="download" style="width: 18px; height: 18px;"></i><span>Download MP3</span>';
    circleProgressContainer.style.display = 'none';
    trackCard.classList.remove('spinning');

    trackResult.style.display = 'block';
    lucide.createIcons();
  }

  // Circular progress controller
  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circleElement.style.strokeDashoffset = offset;
    circleProgressPercent.textContent = `${Math.round(percent)}%`;
  }

  // Real-time circular downloading queue process
  async function startPremiumDownload() {
    if (!activeTrackData || isDownloading) return;

    isDownloading = true;
    downloadBtn.disabled = true;
    downloadBtn.style.display = 'none';
    circleProgressContainer.style.display = 'flex';
    trackCard.classList.add('spinning');

    // Add active queue card in sidebar
    queueCard.style.display = 'block';
    queueContainer.innerHTML = `
      <div class="queue-card" id="activeQueueItem">
        <img class="queue-art" src="${activeTrackData.cover}" alt="Art">
        <div class="queue-meta">
          <div class="queue-name">${activeTrackData.title}</div>
          <div class="queue-artist">${activeTrackData.artist}</div>
        </div>
        <div style="font-family: var(--font-code); font-size: 0.8rem; font-weight: 700; color: var(--spotify-green);" id="queuePercent">0%</div>
      </div>
    `;

    const downloadUrl = activeTrackData.downloadLink;
    const fileName = `${activeTrackData.title} - ${activeTrackData.artist}.mp3`;

    try {
      // Try high-fidelity direct blob fetch first (tracks actual network progress if CORS allowed)
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('CORS block or server down');

      const contentLength = response.headers.get('content-length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
      
      const reader = response.body.getReader();
      let receivedBytes = 0;
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        receivedBytes += value.length;

        if (totalBytes > 0) {
          const percent = (receivedBytes / totalBytes) * 100;
          updateProgressUI(percent);
        }
      }

      // Convert downloaded chunks into a local file blob
      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(blob);

      // Trigger instant direct page download
      triggerLocalDownload(blobUrl, fileName);
      finalizeDownload();

    } catch (e) {
      console.warn("Direct blob download failed (expected CORS restriction). Falling back to premium simulated progress + hidden iframe trigger.", e);
      
      // Fallback: smooth premium simulated progress ring
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10 + 4;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          updateProgressUI(100);

          setTimeout(() => {
            // Trigger download via hidden iframe to completely prevent opening a new tab
            triggerIframeDownload(downloadUrl);
            finalizeDownload();
          }, 500);
        } else {
          updateProgressUI(progress);
        }
      }, 100);
    }
  }

  function updateProgressUI(percent) {
    setProgress(percent);
    const queueItem = document.getElementById('activeQueueItem');
    const queuePercentText = document.getElementById('queuePercent');
    if (queueItem) {
      queueItem.style.setProperty('--progress-width', `${percent}%`);
    }
    if (queuePercentText) {
      queuePercentText.textContent = `${Math.round(percent)}%`;
    }
  }

  function triggerLocalDownload(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function triggerIframeDownload(url) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 60000); // Clean up after download triggers
  }

  function finalizeDownload() {
    showToast('Download complete!');
    isDownloading = false;
    trackCard.classList.remove('spinning');

    // Switch downloadBtn back to checkmark
    circleProgressContainer.style.display = 'none';
    downloadBtn.style.display = 'flex';
    downloadBtn.innerHTML = '<i data-lucide="check" style="color: var(--spotify-green); width: 18px; height: 18px;"></i><span>Downloaded!</span>';

    // Move from active queue to library list
    queueCard.style.display = 'none';
    saveToLibrary(activeTrackData);
  }

  // Save to Library list
  function saveToLibrary(trackInfo) {
    const id = trackInfo.title + trackInfo.artist;
    if (downloadHistory.some(item => (item.title + item.artist) === id)) {
      return;
    }

    const newItem = {
      title: trackInfo.title || 'Unknown Track',
      artist: trackInfo.artist || 'Unknown Artist',
      coverUrl: trackInfo.cover || 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=100&auto=format&fit=crop',
      downloadUrl: trackInfo.downloadLink
    };

    downloadHistory.unshift(newItem);
    if (downloadHistory.length > 20) {
      downloadHistory.pop();
    }

    localStorage.setItem('spoti_download_history', JSON.stringify(downloadHistory));
    updateLibraryUI();
  }

  function updateLibraryUI() {
    if (downloadHistory.length === 0) {
      emptyHistory.style.display = 'flex';
      Array.from(libraryScroller.children).forEach(child => {
        if (child !== emptyHistory) child.remove();
      });
      return;
    }

    emptyHistory.style.display = 'none';

    // Clear previous items
    Array.from(libraryScroller.children).forEach(child => {
      if (child !== emptyHistory) child.remove();
    });

    downloadHistory.forEach(item => {
      const libraryItem = document.createElement('div');
      libraryItem.className = 'library-item';
      libraryItem.innerHTML = `
        <img class="library-art" src="${item.coverUrl}" alt="Cover">
        <div class="library-info">
          <div class="library-name" title="${item.title}">${item.title}</div>
          <div class="library-artist" title="${item.artist}">${item.artist}</div>
        </div>
        <button class="btn-library-action" data-url="${item.downloadUrl}" title="Download Again">
          <i data-lucide="download" style="width: 14px; height: 14px;"></i>
        </button>
      `;

      const downloadBtn = libraryItem.querySelector('.btn-library-action');
      downloadBtn.addEventListener('click', () => {
        showToast('Starting download...');
        triggerIframeDownload(item.downloadUrl);
      });

      libraryScroller.appendChild(libraryItem);
    });

    lucide.createIcons();
  }
});
