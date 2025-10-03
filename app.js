// VoiceOver Studio - Enhanced Audio Application Logic
class VoiceOverStudio {
    constructor() {
        this.emotionalTones = {
            "spiritual": {
                "name": "Spiritual",
                "pitch": 0.8,
                "rate": 0.7,
                "volume": 0.8,
                "pauseMultiplier": 1.5,
                "description": "Calm, meditative, and peaceful tone",
                "color": "#8B5CF6",
                "bgColor": "rgba(139, 92, 246, 0.1)"
            },
            "joyful": {
                "name": "Joyful", 
                "pitch": 1.3,
                "rate": 1.2,
                "volume": 1.0,
                "pauseMultiplier": 0.7,
                "description": "Happy, upbeat, and energetic tone",
                "color": "#F59E0B",
                "bgColor": "rgba(245, 158, 11, 0.1)"
            },
            "sad": {
                "name": "Sad",
                "pitch": 0.7,
                "rate": 0.6,
                "volume": 0.7,
                "pauseMultiplier": 1.8,
                "description": "Melancholic and sorrowful tone",
                "color": "#3B82F6",
                "bgColor": "rgba(59, 130, 246, 0.1)"
            },
            "confused": {
                "name": "Confused",
                "pitch": 1.1,
                "rate": 0.8,
                "volume": 0.9,
                "pauseMultiplier": 1.3,
                "description": "Uncertain and questioning tone",
                "color": "#A855F7",
                "bgColor": "rgba(168, 85, 247, 0.1)"
            },
            "excited": {
                "name": "Excited",
                "pitch": 1.4,
                "rate": 1.3,
                "volume": 1.0,
                "pauseMultiplier": 0.5,
                "description": "Enthusiastic and energetic tone",
                "color": "#EF4444",
                "bgColor": "rgba(239, 68, 68, 0.1)"
            },
            "calm": {
                "name": "Calm",
                "pitch": 1.0,
                "rate": 1.0,
                "volume": 0.9,
                "pauseMultiplier": 1.0,
                "description": "Peaceful and steady tone",
                "color": "#10B981",
                "bgColor": "rgba(16, 185, 129, 0.1)"
            },
            "angry": {
                "name": "Angry",
                "pitch": 0.8,
                "rate": 1.1,
                "volume": 1.0,
                "pauseMultiplier": 0.8,
                "description": "Intense and forceful tone",
                "color": "#DC2626",
                "bgColor": "rgba(220, 38, 38, 0.1)"
            },
            "fearful": {
                "name": "Fearful",
                "pitch": 1.2,
                "rate": 0.9,
                "volume": 0.8,
                "pauseMultiplier": 1.2,
                "description": "Anxious and worried tone",
                "color": "#7C3AED",
                "bgColor": "rgba(124, 58, 237, 0.1)"
            },
            "confident": {
                "name": "Confident",
                "pitch": 0.9,
                "rate": 1.1,
                "volume": 1.0,
                "pauseMultiplier": 0.9,
                "description": "Assertive and self-assured tone",
                "color": "#059669",
                "bgColor": "rgba(5, 150, 105, 0.1)"
            },
            "mysterious": {
                "name": "Mysterious",
                "pitch": 0.8,
                "rate": 0.8,
                "volume": 0.8,
                "pauseMultiplier": 1.4,
                "description": "Intriguing and enigmatic tone",
                "color": "#4338CA",
                "bgColor": "rgba(67, 56, 202, 0.1)"
            }
        };

        this.sampleScripts = {
            "spiritual": "Take a deep breath and center yourself. In this moment of stillness, find the peace that lies within. Let go of all worries and embrace the tranquility of the present.",
            "joyful": "What an absolutely wonderful day this is! The sun is shining, birds are singing, and everything feels possible. Let's celebrate this beautiful moment together!",
            "sad": "It's never easy to say goodbye to someone we love. Though our hearts are heavy with sorrow, we carry their memory with us always. They will never be forgotten.",
            "confused": "Wait, I'm not sure I understand this correctly. Could you explain that again? There seems to be something I'm missing here. This is quite puzzling...",
            "excited": "Oh my goodness, I can't believe this is happening! This is absolutely incredible news! I'm so thrilled and excited, I can barely contain myself!",
            "calm": "Welcome to today's meditation session. Please find a comfortable position and close your eyes. Focus on your breathing as we begin this peaceful journey together.",
            "angry": "This is completely unacceptable! I've had enough of these constant delays and excuses. Something needs to change right now, and I mean it!",
            "fearful": "Did you hear that sound? I think someone might be following us. We need to be very careful and stay together. I'm getting really worried about this situation.",
            "confident": "I know we can achieve this goal together. With our skills, determination, and teamwork, there's nothing we can't accomplish. Let's move forward with confidence.",
            "mysterious": "In the shadows of the old mansion, secrets whispered through the halls. What happened that night remains unknown... but some say if you listen carefully, you can still hear them."
        };

        this.currentUtterance = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.voices = [];
        this.currentProgress = 0;
        this.totalDuration = 0;
        this.progressInterval = null;
        this.selectedTone = 'calm';
        this.waveformAnimation = null;

        this.init();
    }

    init() {
        this.initializeElements();
        this.createToneButtons();
        this.populatePresetScripts();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.setupSliderTracking();
        this.drawWaveform();
        
        // Load voices with multiple attempts
        this.loadVoices();
        
        // Check for Web Speech API support
        if (!('speechSynthesis' in window)) {
            this.showError('Your browser does not support the Web Speech API. Please use a modern browser like Chrome, Firefox, or Safari.');
        } else {
            this.updateStatus('Ready', 'info');
        }

        // Initial UI state
        this.updateButtonStates();
        this.updateScriptStats();
        this.analyzeText();
        this.selectTone('calm'); // Default selection
    }

    initializeElements() {
        // Get all DOM elements
        this.elements = {
            scriptInput: document.getElementById('scriptInput'),
            presetSelect: document.getElementById('presetSelect'),
            clearBtn: document.getElementById('clearBtn'),
            toneGrid: document.getElementById('toneGrid'),
            voiceSelect: document.getElementById('voiceSelect'),
            pitchSlider: document.getElementById('pitchSlider'),
            rateSlider: document.getElementById('rateSlider'),
            volumeSlider: document.getElementById('volumeSlider'),
            pauseMultiplier: document.getElementById('pauseMultiplier'),
            ssmlMode: document.getElementById('ssmlMode'),
            advancedToggle: document.getElementById('advancedToggle'),
            advancedSettings: document.getElementById('advancedSettings'),
            previewBtn: document.getElementById('previewBtn'),
            generateBtn: document.getElementById('generateBtn'),
            playPauseBtn: document.getElementById('playPauseBtn'),
            stopBtn: document.getElementById('stopBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            statusIndicator: document.getElementById('statusIndicator'),
            progressFill: document.getElementById('progressFill'),
            currentTime: document.getElementById('currentTime'),
            totalTime: document.getElementById('totalTime'),
            charCount: document.getElementById('charCount'),
            wordCount: document.getElementById('wordCount'),
            estimatedDuration: document.getElementById('estimatedDuration'),
            analysisContent: document.getElementById('analysisContent'),
            pitchValue: document.getElementById('pitchValue'),
            rateValue: document.getElementById('rateValue'),
            volumeValue: document.getElementById('volumeValue'),
            pauseValue: document.getElementById('pauseValue'),
            playPauseIcon: document.getElementById('playPauseIcon'),
            waveform: document.getElementById('waveform'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            errorModal: document.getElementById('errorModal'),
            errorMessage: document.getElementById('errorMessage'),
            modalClose: document.getElementById('modalClose'),
            modalOkBtn: document.getElementById('modalOkBtn')
        };
    }

    createToneButtons() {
        const grid = this.elements.toneGrid;
        grid.innerHTML = '';

        Object.keys(this.emotionalTones).forEach(key => {
            const tone = this.emotionalTones[key];
            const button = document.createElement('button');
            button.className = 'tone-btn';
            button.dataset.tone = key;
            button.style.color = tone.color;
            button.style.borderColor = tone.color + '30'; // Add transparency
            
            button.innerHTML = `
                <span class="tone-name">${tone.name}</span>
                <span class="tone-desc">${tone.description}</span>
            `;

            button.addEventListener('click', () => {
                this.selectTone(key);
                this.applyToneSettings();
            });

            grid.appendChild(button);
        });

        console.log('Tone buttons created:', Object.keys(this.emotionalTones).length);
    }

    selectTone(toneKey) {
        // Remove active class from all buttons
        document.querySelectorAll('.tone-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected button
        const selectedBtn = document.querySelector(`[data-tone="${toneKey}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
            const tone = this.emotionalTones[toneKey];
            selectedBtn.style.backgroundColor = tone.bgColor;
            selectedBtn.style.boxShadow = `0 0 20px ${tone.color}40`;
        }

        this.selectedTone = toneKey;
        console.log('Tone selected:', toneKey);
    }

    loadVoices() {
        const loadVoicesHandler = () => {
            this.voices = speechSynthesis.getVoices();
            console.log('Loaded voices:', this.voices.length);
            this.populateVoiceSelect();
        };

        // Chrome loads voices asynchronously
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoicesHandler;
        }
        
        // Immediate load for browsers that have voices ready
        loadVoicesHandler();
        
        // Fallback attempts
        setTimeout(loadVoicesHandler, 100);
        setTimeout(loadVoicesHandler, 500);
        setTimeout(loadVoicesHandler, 1000);
    }

    populateVoiceSelect() {
        const select = this.elements.voiceSelect;
        select.innerHTML = '';

        if (this.voices.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'Default System Voice';
            option.value = '';
            select.appendChild(option);
            return;
        }

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Default System Voice';
        defaultOption.value = '';
        select.appendChild(defaultOption);

        // Group voices by language
        const voicesByLang = {};
        this.voices.forEach((voice, index) => {
            const lang = voice.lang.split('-')[0];
            if (!voicesByLang[lang]) voicesByLang[lang] = [];
            voicesByLang[lang].push({ voice, index });
        });

        // Add voices to select, prioritizing English
        const sortedLangs = Object.keys(voicesByLang).sort((a, b) => {
            if (a === 'en') return -1;
            if (b === 'en') return 1;
            return a.localeCompare(b);
        });

        sortedLangs.forEach(lang => {
            voicesByLang[lang].forEach(({ voice, index }) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${voice.name} (${voice.lang})`;
                select.appendChild(option);
            });
        });

        console.log('Voice select populated with', select.options.length, 'options');
    }

    populatePresetScripts() {
        const select = this.elements.presetSelect;
        select.innerHTML = '<option value="">Choose a sample script...</option>';

        Object.keys(this.sampleScripts).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = this.emotionalTones[key].name;
            select.appendChild(option);
        });

        console.log('Preset scripts populated with', select.options.length, 'options');
    }

    setupSliderTracking() {
        // Update slider backgrounds based on their values
        const updateSliderBackground = (slider, value) => {
            const percentage = ((value - slider.min) / (slider.max - slider.min)) * 100;
            slider.style.setProperty('--value', percentage + '%');
        };

        // Set up all sliders
        [this.elements.pitchSlider, this.elements.rateSlider, 
         this.elements.volumeSlider, this.elements.pauseMultiplier].forEach(slider => {
            const updateValue = () => {
                updateSliderBackground(slider, slider.value);
            };
            
            slider.addEventListener('input', updateValue);
            updateValue(); // Initial update
        });
    }

    setupEventListeners() {
        // Script input events
        this.elements.scriptInput.addEventListener('input', (e) => {
            console.log('Text input changed:', e.target.value.length, 'characters');
            this.updateScriptStats();
            this.analyzeText();
            this.updateButtonStates();
        });

        this.elements.scriptInput.addEventListener('keyup', (e) => {
            this.updateScriptStats();
            this.analyzeText();
            this.updateButtonStates();
        });

        this.elements.scriptInput.addEventListener('paste', (e) => {
            setTimeout(() => {
                this.updateScriptStats();
                this.analyzeText();
                this.updateButtonStates();
            }, 10);
        });

        // Preset selection
        this.elements.presetSelect.addEventListener('change', (e) => {
            console.log('Preset selected:', e.target.value);
            if (e.target.value) {
                this.elements.scriptInput.value = this.sampleScripts[e.target.value];
                this.selectTone(e.target.value);
                this.applyToneSettings();
                this.updateScriptStats();
                this.analyzeText();
                this.updateButtonStates();
            }
        });

        // Clear button
        this.elements.clearBtn.addEventListener('click', () => {
            console.log('Clear button clicked');
            this.elements.scriptInput.value = '';
            this.elements.presetSelect.value = '';
            this.updateScriptStats();
            this.analyzeText();
            this.updateButtonStates();
            this.stopPlayback();
        });

        // Slider events with enhanced visual feedback
        this.elements.pitchSlider.addEventListener('input', (e) => {
            this.elements.pitchValue.textContent = e.target.value;
            this.updateSliderBackground(e.target, e.target.value);
        });

        this.elements.rateSlider.addEventListener('input', (e) => {
            this.elements.rateValue.textContent = e.target.value;
            this.updateSliderBackground(e.target, e.target.value);
        });

        this.elements.volumeSlider.addEventListener('input', (e) => {
            this.elements.volumeValue.textContent = e.target.value;
            this.updateSliderBackground(e.target, e.target.value);
        });

        this.elements.pauseMultiplier.addEventListener('input', (e) => {
            this.elements.pauseValue.textContent = e.target.value;
            this.updateSliderBackground(e.target, e.target.value);
        });

        // Advanced settings toggle
        this.elements.advancedToggle.addEventListener('click', () => {
            console.log('Advanced toggle clicked');
            const isHidden = this.elements.advancedSettings.classList.contains('hidden');
            this.elements.advancedSettings.classList.toggle('hidden');
            this.elements.advancedToggle.textContent = isHidden ? 'Hide Advanced' : 'Advanced Settings';
        });

        // Action buttons
        this.elements.previewBtn.addEventListener('click', () => {
            console.log('Preview button clicked');
            this.previewVoiceover();
        });

        this.elements.generateBtn.addEventListener('click', () => {
            console.log('Generate button clicked');
            this.generateVoiceover();
        });
        
        // Playback controls
        this.elements.playPauseBtn.addEventListener('click', () => {
            console.log('Play/Pause button clicked');
            this.togglePlayPause();
        });

        this.elements.stopBtn.addEventListener('click', () => {
            console.log('Stop button clicked');
            this.stopPlayback();
        });

        this.elements.downloadBtn.addEventListener('click', () => {
            console.log('Download button clicked');
            this.downloadAudio();
        });

        // Modal events
        this.elements.modalClose.addEventListener('click', () => this.hideModal());
        this.elements.modalOkBtn.addEventListener('click', () => this.hideModal());
        this.elements.errorModal.addEventListener('click', (e) => {
            if (e.target === this.elements.errorModal) this.hideModal();
        });

        console.log('Event listeners setup complete');
    }

    updateSliderBackground(slider, value) {
        const percentage = ((value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.setProperty('--value', percentage + '%');
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter to generate
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                if (!this.elements.generateBtn.disabled) {
                    this.generateVoiceover();
                }
            }
            
            // Space to play/pause (when not focused on text input)
            if (e.key === ' ' && e.target !== this.elements.scriptInput) {
                e.preventDefault();
                if (!this.elements.playPauseBtn.disabled) {
                    this.togglePlayPause();
                }
            }
        });
    }

    applyToneSettings() {
        const selectedTone = this.emotionalTones[this.selectedTone];
        if (!selectedTone) return;

        this.elements.pitchSlider.value = selectedTone.pitch;
        this.elements.rateSlider.value = selectedTone.rate;
        this.elements.volumeSlider.value = selectedTone.volume;
        this.elements.pauseMultiplier.value = selectedTone.pauseMultiplier;

        this.elements.pitchValue.textContent = selectedTone.pitch;
        this.elements.rateValue.textContent = selectedTone.rate;
        this.elements.volumeValue.textContent = selectedTone.volume;
        this.elements.pauseValue.textContent = selectedTone.pauseMultiplier;

        // Update slider backgrounds
        this.updateSliderBackground(this.elements.pitchSlider, selectedTone.pitch);
        this.updateSliderBackground(this.elements.rateSlider, selectedTone.rate);
        this.updateSliderBackground(this.elements.volumeSlider, selectedTone.volume);
        this.updateSliderBackground(this.elements.pauseMultiplier, selectedTone.pauseMultiplier);

        console.log('Applied tone settings:', selectedTone.name);
    }

    updateScriptStats() {
        const text = this.elements.scriptInput.value;
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const estimatedDuration = Math.round((wordCount / 150) * 60); // 150 WPM average

        this.elements.charCount.textContent = `${charCount} characters`;
        this.elements.wordCount.textContent = `${wordCount} words`;
        this.elements.estimatedDuration.textContent = `~${estimatedDuration}s`;
    }

    analyzeText() {
        const text = this.elements.scriptInput.value;
        if (!text.trim()) {
            this.elements.analysisContent.innerHTML = '<p class="help-text">Enter text above to see pause and emphasis analysis</p>';
            return;
        }

        let analyzedText = text;
        
        // Detect and mark different types of pauses
        analyzedText = analyzedText
            // Long pauses (sentences)
            .replace(/([.!?])\s+/g, '$1<span class="pause-long"> [LONG PAUSE] </span>')
            // Medium pauses (clauses)
            .replace(/([,;:])\s+/g, '$1<span class="pause-medium"> [PAUSE] </span>')
            // Extended pauses (ellipsis)
            .replace(/\.\.\./g, '<span class="pause-long">... [EXTENDED PAUSE]</span>')
            // Emphasis (ALL CAPS)
            .replace(/\b[A-Z]{2,}\b/g, '<span class="emphasis">$&</span>')
            // Emphasis (bold markdown)
            .replace(/\*\*(.*?)\*\*/g, '<span class="emphasis">$1</span>')
            // Emphasis (italic markdown)
            .replace(/\*(.*?)\*/g, '<span class="emphasis">$1</span>');

        this.elements.analysisContent.innerHTML = analyzedText;
    }

    updateButtonStates() {
        const hasText = this.elements.scriptInput.value.trim().length > 0;
        this.elements.previewBtn.disabled = !hasText;
        this.elements.generateBtn.disabled = !hasText;
    }

    previewVoiceover() {
        const text = this.elements.scriptInput.value.trim();
        if (!text) return;

        // Get first 50 words for preview
        const words = text.split(/\s+/).slice(0, 50);
        const previewText = words.join(' ') + (words.length === 50 ? '...' : '');
        
        this.updateStatus('Preparing preview...', 'warning');
        this.speak(previewText, true);
    }

    generateVoiceover() {
        const text = this.elements.scriptInput.value.trim();
        if (!text) return;

        this.updateStatus('Generating voiceover...', 'warning');
        this.speak(text, false);
    }

    speak(text, isPreview = false) {
        // Stop any current speech
        speechSynthesis.cancel();

        // Process text for intelligent pauses
        const processedText = this.processTextForSpeech(text);
        
        // Create utterance
        this.currentUtterance = new SpeechSynthesisUtterance(processedText);
        
        // Apply voice settings
        if (this.elements.voiceSelect.value !== '') {
            const voiceIndex = parseInt(this.elements.voiceSelect.value);
            if (this.voices[voiceIndex]) {
                this.currentUtterance.voice = this.voices[voiceIndex];
            }
        }
        
        this.currentUtterance.pitch = parseFloat(this.elements.pitchSlider.value);
        this.currentUtterance.rate = parseFloat(this.elements.rateSlider.value);
        this.currentUtterance.volume = parseFloat(this.elements.volumeSlider.value);

        console.log('Speaking with settings:', {
            pitch: this.currentUtterance.pitch,
            rate: this.currentUtterance.rate,
            volume: this.currentUtterance.volume,
            voice: this.currentUtterance.voice ? this.currentUtterance.voice.name : 'default'
        });

        // Set up event handlers
        this.currentUtterance.onstart = () => {
            console.log('Speech started');
            this.isPlaying = true;
            this.isPaused = false;
            this.updatePlaybackUI();
            this.startProgressTracking();
            
            if (!isPreview) {
                this.updateStatus('Playing', 'success');
                this.animateWaveform();
            } else {
                this.updateStatus('Previewing', 'info');
            }
        };

        this.currentUtterance.onend = () => {
            console.log('Speech ended');
            this.isPlaying = false;
            this.isPaused = false;
            this.updatePlaybackUI();
            this.stopProgressTracking();
            this.updateStatus('Completed', 'success');
            this.drawWaveform(); // Reset waveform
        };

        this.currentUtterance.onerror = (e) => {
            console.error('Speech error:', e);
            this.showError(`Speech synthesis error: ${e.error}`);
            this.updateStatus('Error', 'error');
            this.isPlaying = false;
            this.updatePlaybackUI();
        };

        this.currentUtterance.onpause = () => {
            console.log('Speech paused');
            this.isPaused = true;
            this.updateStatus('Paused', 'warning');
            this.updatePlaybackUI();
        };

        this.currentUtterance.onresume = () => {
            console.log('Speech resumed');
            this.isPaused = false;
            this.updateStatus('Playing', 'success');
            this.updatePlaybackUI();
        };

        // Show loading and speak
        if (!isPreview) {
            this.showLoading();
            setTimeout(() => this.hideLoading(), 1000);
        }

        try {
            speechSynthesis.speak(this.currentUtterance);
            console.log('Speech synthesis started');
        } catch (error) {
            console.error('Failed to start speech synthesis:', error);
            this.showError('Failed to start speech synthesis. Please try again.');
        }
    }

    processTextForSpeech(text) {
        if (this.elements.ssmlMode.checked) {
            // If SSML mode is enabled, return text as-is for advanced users
            return text;
        }

        const pauseMultiplier = parseFloat(this.elements.pauseMultiplier.value);
        
        // Add pauses based on punctuation
        let processedText = text
            // Long pauses for sentence endings
            .replace(/([.!?])\s+/g, `$1${' '.repeat(Math.round(3 * pauseMultiplier))}`)
            // Medium pauses for clauses
            .replace(/([,;:])\s+/g, `$1${' '.repeat(Math.round(2 * pauseMultiplier))}`)
            // Extended pauses for ellipsis
            .replace(/\.\.\./g, `${' '.repeat(Math.round(4 * pauseMultiplier))}`)
            // Handle parentheses with softer volume (simulated with spacing)
            .replace(/\((.*?)\)/g, ` $1 `);

        return processedText;
    }

    togglePlayPause() {
        if (!this.currentUtterance) return;

        if (this.isPlaying && !this.isPaused) {
            speechSynthesis.pause();
        } else if (this.isPaused) {
            speechSynthesis.resume();
        }
    }

    stopPlayback() {
        speechSynthesis.cancel();
        this.isPlaying = false;
        this.isPaused = false;
        this.currentProgress = 0;
        this.currentUtterance = null;
        this.updatePlaybackUI();
        this.updateStatus('Stopped', 'info');
        this.stopProgressTracking();
        this.drawWaveform(); // Reset waveform
        
        // Stop waveform animation
        if (this.waveformAnimation) {
            cancelAnimationFrame(this.waveformAnimation);
            this.waveformAnimation = null;
        }
    }

    updatePlaybackUI() {
        this.elements.playPauseBtn.disabled = !this.currentUtterance;
        this.elements.stopBtn.disabled = !this.currentUtterance && !this.isPlaying;
        this.elements.downloadBtn.disabled = !this.currentUtterance;
        
        if (this.isPlaying && !this.isPaused) {
            this.elements.playPauseIcon.textContent = '⏸';
        } else {
            this.elements.playPauseIcon.textContent = '▶';
        }
    }

    startProgressTracking() {
        this.currentProgress = 0;
        const text = this.elements.scriptInput.value.trim();
        const wordCount = text.split(/\s+/).length;
        const rate = parseFloat(this.elements.rateSlider.value);
        const estimatedDuration = (wordCount / (150 * rate)) * 60; // Adjust for rate
        this.totalDuration = estimatedDuration;

        this.elements.totalTime.textContent = this.formatTime(estimatedDuration);

        this.progressInterval = setInterval(() => {
            if (this.isPlaying && !this.isPaused) {
                this.currentProgress += 0.1;
                const progressPercent = Math.min((this.currentProgress / this.totalDuration) * 100, 100);
                
                this.elements.progressFill.style.width = `${progressPercent}%`;
                this.elements.currentTime.textContent = this.formatTime(this.currentProgress);
            }
        }, 100);
    }

    stopProgressTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        
        this.elements.progressFill.style.width = '0%';
        this.elements.currentTime.textContent = '0:00';
        this.elements.totalTime.textContent = '0:00';
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    drawWaveform() {
        const canvas = this.elements.waveform;
        const ctx = canvas.getContext('2d');
        
        canvas.width = canvas.offsetWidth * 2; // High DPI
        canvas.height = canvas.offsetHeight * 2;
        canvas.style.width = canvas.offsetWidth + 'px';
        canvas.style.height = canvas.offsetHeight + 'px';
        ctx.scale(2, 2);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw gradient waveform
        const gradient = ctx.createLinearGradient(0, 0, canvas.width/2, 0);
        gradient.addColorStop(0, '#06B6D4');
        gradient.addColorStop(0.5, '#4F46E5');
        gradient.addColorStop(1, '#F59E0B');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        const centerY = canvas.height / 4; // Account for scale
        const amplitude = 20;
        
        for (let x = 0; x < canvas.width / 2; x += 3) {
            const y = centerY + Math.sin(x * 0.02) * amplitude * (0.3 + Math.random() * 0.4);
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }

    animateWaveform() {
        const canvas = this.elements.waveform;
        const ctx = canvas.getContext('2d');
        
        let frame = 0;
        const animate = () => {
            if (!this.isPlaying || this.isPaused) {
                this.waveformAnimation = null;
                return;
            }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Animated gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width/2, 0);
            gradient.addColorStop(0, '#10B981');
            gradient.addColorStop(0.5, '#06B6D4');
            gradient.addColorStop(1, '#EF4444');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            const centerY = canvas.height / 4;
            
            for (let x = 0; x < canvas.width / 2; x += 2) {
                const amplitude = 15 + Math.sin(frame * 0.1) * 10;
                const frequency = 0.02 + Math.sin(frame * 0.05) * 0.01;
                const y = centerY + Math.sin((x + frame) * frequency) * amplitude * (0.7 + Math.random() * 0.6);
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            
            // Add glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#06B6D4';
            ctx.stroke();
            
            frame += 3;
            
            this.waveformAnimation = requestAnimationFrame(animate);
        };
        
        animate();
    }

    updateStatus(text, type) {
        this.elements.statusIndicator.textContent = text;
        this.elements.statusIndicator.className = `status status--${type} pulse-glow`;
    }

    downloadAudio() {
        // Note: Direct audio download from Web Speech API is not supported
        // This is a placeholder for future enhancement or using a different API
        this.showError('Audio download is not currently supported by the Web Speech API. This feature would require a server-side text-to-speech service or additional browser APIs.');
    }

    showLoading() {
        this.elements.loadingOverlay.classList.remove('hidden');
    }

    hideLoading() {
        this.elements.loadingOverlay.classList.add('hidden');
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorModal.classList.remove('hidden');
    }

    hideModal() {
        this.elements.errorModal.classList.add('hidden');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing VoiceOver Studio...');
    new VoiceOverStudio();
});
