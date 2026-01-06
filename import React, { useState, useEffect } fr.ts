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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Music className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold">Audio → MIDI Converter</h1>
          </div>
          <p className="text-slate-300">Using Spotify's basic-pitch model for accurate transcription</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-red-200">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-900/50 border border-green-500 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-green-200 whitespace-pre-line">{success}</span>
          </div>
        )}

        {status && (
          <div className="mb-4 p-4 bg-blue-900/50 border border-blue-500 rounded-lg flex items-center gap-3">
            <Loader className="w-5 h-5 text-blue-400 animate-spin" />
            <span className="text-blue-200">{status}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Selection */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Audio Files
              </h2>
              <label className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors text-sm font-medium">
                Upload Files
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
                <div className="text-center py-12 text-slate-400">
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
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedFile?.name === file.name
                        ? 'bg-purple-600/30 border-2 border-purple-500'
                        : 'bg-slate-700/50 border border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Music className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-slate-400">{file.size}</p>
                        </div>
                      </div>
                      {selectedFile?.name === file.name && (
                        <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Settings & Conversion */}
          <div className="space-y-6">
            {/* Settings Panel */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div 
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Conversion Settings
                </h2>
                <span className="text-sm text-slate-400">
                  {showAdvanced ? '▼' : '▶'} Advanced
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
                    <p className="text-sm text-slate-400">Recommended for consistent results</p>
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
                    <p className="text-sm text-slate-400">Better for single instruments</p>
                  </div>
                </label>
              </div>

              {/* Advanced Settings */}
              {showAdvanced && (
                <div className="space-y-4 pt-4 border-t border-slate-700">
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
                    <p className="text-xs text-slate-400 mt-1">
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
                    <p className="text-xs text-slate-400 mt-1">
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
                    <p className="text-xs text-slate-400 mt-1">
                      Shortest note to detect
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Convert Button */}
            <button
              onClick={convertToMidi}
              disabled={!selectedFile || converting}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3"
            >
              {converting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Convert to MIDI
                </>
              )}
            </button>

            {/* Command Line Preview */}
            {selectedFile && (
              <div className="bg-slate-950/50 border border-slate-700 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-2 font-mono">Command line equivalent:</p>
                <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                  {getCommandLine()}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400" />
            What to Expect
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <p className="font-medium text-green-400 mb-1">✓ Works Well With:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Solo melodic instruments</li>
                <li>Clean recordings</li>
                <li>Monophonic passages</li>
                <li>Clear pitch definition</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-amber-400 mb-1">⚠ Challenging:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Heavy reverb/effects</li>
                <li>Polyphonic content (chords)</li>
                <li>Multiple instruments</li>
                <li>Percussion-heavy tracks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}