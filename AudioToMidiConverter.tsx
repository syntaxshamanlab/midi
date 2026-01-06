import React, { useState, useEffect } from 'react';
import { Upload, Music, Download, Settings, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function AudioToMidiConverter() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [settings, setSettings] = useState({
    onsetThreshold: 0.5,
    frameThreshold: 0.3,
    minimumNoteLength: 127.70,
    normalize: true,
    toMono: true
  });

  useEffect(() => {
    loadAudioFiles();
  }, []);

  const loadAudioFiles = async () => {
    setStatus('Scanning for audio files...');

    // Simulated file discovery - in real implementation, this would use file system API
    const mockFiles = [
      { name: 'guitar_solo.wav', path: './audio/guitar_solo.wav', size: '2.4 MB' },
      { name: 'vocal_melody.mp3', path: './audio/vocal_melody.mp3', size: '3.1 MB' },
      { name: 'flute_piece.flac', path: './audio/flute_piece.flac', size: '5.2 MB' },
      { name: 'bass_line.wav', path: './audio/bass_line.wav', size: '1.8 MB' },
    ];

    setFiles(mockFiles);
    setStatus('');
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const audioFiles = uploadedFiles.filter(file =>
      file.type.startsWith('audio/') ||
      ['.wav', '.mp3', '.flac', '.ogg', '.m4a'].some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (audioFiles.length === 0) {
      setError('Please upload valid audio files');
      return;
    }

    const newFiles = audioFiles.map(file => ({
      name: file.name,
      path: URL.createObjectURL(file),
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      file: file
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setSuccess(`Added ${audioFiles.length} file(s)`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const convertToMidi = async () => {
    if (!selectedFile) {
      setError('Please select a file to convert');
      return;
    }

    setConverting(true);
    setError('');
    setSuccess('');
    setStatus('Preprocessing audio...');

    try {
      // Simulate preprocessing
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (settings.normalize || settings.toMono) {
        setStatus('Normalizing and converting to mono...');
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Simulate conversion
      setStatus('Running basic-pitch model...');
      await new Promise(resolve => setTimeout(resolve, 2500));

      setStatus('Generating MIDI file...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create mock MIDI download
      const midiFilename = selectedFile.name.replace(/\.[^/.]+$/, '') + '_basic_pitch.mid';

      setSuccess(`✓ Converted successfully: ${midiFilename}`);
      setStatus('');

      // In real implementation, trigger actual download
      // For demo, just show success message
      setTimeout(() => {
        setSuccess(prev => prev + '\n\nReady to download from output folder');
      }, 500);

    } catch (err) {
      setError(`Conversion failed: ${err.message}`);
    } finally {
      setConverting(false);
    }
  };

  const getCommandLine = () => {
    const file = selectedFile ? selectedFile.path : 'input.wav';
    return `basic-pitch output ${file} \\
  --onset-threshold ${settings.onsetThreshold} \\
  --frame-threshold ${settings.frameThreshold} \\
  --minimum-note-length ${settings.minimumNoteLength} \\
  --save-midi`;
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-12">
        <h1 className="text-5xl font-bold tracking-tighter text-white mb-2">
          COMMAND CENTER: MIDI TRANSCRIPTION
        </h1>
        <p className="text-[#A1A1AA] uppercase tracking-widest text-xs">
          High-Throughput Neural Pitch Detection
        </p>
      </header>

      {/* Status Messages */}
      {error && (
        <div className="max-w-6xl mx-auto mb-4 p-4 bg-[#1A1A1A] border border-red-900 text-red-400">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-6xl mx-auto mb-4 p-4 bg-[#1A1A1A] border border-green-900 text-green-400">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="whitespace-pre-line">{success}</span>
          </div>
        </div>
      )}

      {status && (
        <div className="max-w-6xl mx-auto mb-4 p-4 bg-[#1A1A1A] border border-blue-900 text-blue-400">
          <div className="flex items-center gap-3">
            <Loader className="w-5 h-5 animate-spin" />
            <span>{status}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Section 1: Data Input */}
        <section className="lg:col-span-7 bg-[#1A1A1A] border border-stone-800 p-6">
          <div className="flex items-center justify-between mb-6 border-b border-stone-800 pb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Upload className="w-5 h-5" />
              01. SOURCE SELECTION
            </h2>
            <label className="px-4 py-2 bg-[#CD7F32] hover:bg-[#A0522D] text-black font-bold cursor-pointer transition-all duration-200 ease-in-out">
              UPLOAD FILES
              <input
                type="file"
                multiple
                accept="audio/*,.wav,.mp3,.flac,.ogg,.m4a"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {files.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No audio files found</p>
                <p className="text-sm mt-1">Upload files or place them in ./audio folder</p>
              </div>
            ) : (
              files.map((file, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedFile(file);
                    setError('');
                  }}
                  className={`p-4 cursor-pointer transition-all duration-200 ease-in-out ${
                    selectedFile?.name === file.name
                      ? 'bg-[#CD7F32]/20 border-2 border-[#CD7F32]'
                      : 'bg-stone-900/50 border border-stone-700 hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Music className="w-5 h-5 text-[#CD7F32] flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-stone-400">{file.size}</p>
                      </div>
                    </div>
                    {selectedFile?.name === file.name && (
                      <CheckCircle className="w-5 h-5 text-[#CD7F32] flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section 2: Logic & Execution */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-[#1A1A1A] border border-stone-800 p-6">
            <div
              className="flex items-center justify-between mb-6 border-b border-stone-800 pb-2 cursor-pointer"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                02. PARAMETERS
              </h2>
              <span className="text-sm text-stone-400">
                {showAdvanced ? '▼' : '▶'} ADVANCED
              </span>
            </div>

            {/* Quick Settings */}
            <div className="space-y-4 mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.normalize}
                  onChange={(e) => setSettings({...settings, normalize: e.target.checked})}
                  className="w-5 h-5 rounded"
                />
                <div>
                  <span className="font-medium">Normalize Volume</span>
                  <p className="text-sm text-stone-400">Recommended for consistent results</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.toMono}
                  onChange={(e) => setSettings({...settings, toMono: e.target.checked})}
                  className="w-5 h-5 rounded"
                />
                <div>
                  <span className="font-medium">Convert to Mono</span>
                  <p className="text-sm text-stone-400">Better for single instruments</p>
                </div>
              </label>
            </div>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="space-y-4 pt-4 border-t border-stone-700">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Onset Threshold: {settings.onsetThreshold}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.1"
                    value={settings.onsetThreshold}
                    onChange={(e) => setSettings({...settings, onsetThreshold: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                  <p className="text-xs text-stone-400 mt-1">
                    Higher = fewer false notes, may miss soft attacks
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Frame Threshold: {settings.frameThreshold}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.1"
                    value={settings.frameThreshold}
                    onChange={(e) => setSettings({...settings, frameThreshold: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                  <p className="text-xs text-stone-400 mt-1">
                    Higher = stricter note detection
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Min Note Length: {settings.minimumNoteLength}ms
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={settings.minimumNoteLength}
                    onChange={(e) => setSettings({...settings, minimumNoteLength: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                  <p className="text-xs text-stone-400 mt-1">
                    Shortest note to detect
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={convertToMidi}
            disabled={!selectedFile || converting}
            className="w-full py-4 bg-[#CD7F32] hover:bg-[#A0522D] disabled:bg-stone-700 disabled:cursor-not-allowed text-black font-bold transition-all duration-200 ease-in-out flex items-center justify-center gap-3"
          >
            {converting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                PROCESSING...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                EXECUTE CONVERSION
              </>
            )}
          </button>

          {/* Command Line Preview */}
          {selectedFile && (
            <div className="bg-stone-950 border border-stone-700 p-4">
              <p className="text-xs text-stone-400 mb-2 font-mono">COMMAND LINE EQUIVALENT:</p>
              <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                {getCommandLine()}
              </pre>
            </div>
          )}
        </section>
      </div>

      <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t border-stone-800 text-stone-500 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <p className="font-bold text-green-400 mb-2">✓ OPTIMAL PERFORMANCE:</p>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>Solo melodic instruments</li>
              <li>Clean recordings</li>
              <li>Monophonic passages</li>
              <li>Clear pitch definition</li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-amber-400 mb-2">⚠ SUBOPTIMAL:</p>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>Heavy reverb/effects</li>
              <li>Polyphonic content (chords)</li>
              <li>Multiple instruments</li>
              <li>Percussion-heavy tracks</li>
            </ul>
          </div>
        </div>
        <p className="text-center">RELIABILITY MANDATE: SYSTEM ACTIVE</p>
      </footer>
    </main>
  );
}