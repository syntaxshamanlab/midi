#!/usr/bin/env python3
"""
Audio to MIDI Conversion Script using basic-pitch
Batch converts audio files to MIDI format.
"""

import os
import sys
from pathlib import Path
from basic_pitch.inference import predict
from basic_pitch import ICASSP_2022_MODEL_PATH


def batch_convert(input_folder: str, output_folder: str) -> None:
    """
    Batch convert audio files to MIDI using basic-pitch.

    Args:
        input_folder: Path to folder containing audio files
        output_folder: Path to folder where MIDI files will be saved
    """
    # Supported audio file extensions
    audio_extensions = ['.wav', '.mp3', '.flac', '.ogg', '.m4a']

    # Create output directory if it doesn't exist
    Path(output_folder).mkdir(parents=True, exist_ok=True)

    # Counter for processed files
    processed = 0
    failed = 0

    print(f"Starting batch conversion from '{input_folder}' to '{output_folder}'")
    print("-" * 60)

    # Iterate through files in input folder
    for filename in os.listdir(input_folder):
        if any(filename.lower().endswith(ext) for ext in audio_extensions):
            input_path = os.path.join(input_folder, filename)
            print(f"Processing: {filename}")

            try:
                predict(
                    audio_path=input_path,
                    output_directory=output_folder,
                    save_midi=True,
                    model_or_model_path=ICASSP_2022_MODEL_PATH
                )
                print(f"✓ Converted: {filename}")
                processed += 1
            except Exception as e:
                print(f"✗ Failed: {filename} - {str(e)}")
                failed += 1

    print("-" * 60)
    print(f"Batch conversion complete!")
    print(f"Successfully processed: {processed} files")
    if failed > 0:
        print(f"Failed: {failed} files")


def main():
    """Main function to handle command line arguments."""
    if len(sys.argv) != 3:
        print("Usage: python audio_to_midi.py <input_folder> <output_folder>")
        print("Example: python audio_to_midi.py audio_input midi_output")
        sys.exit(1)

    input_folder = sys.argv[1]
    output_folder = sys.argv[2]

    # Validate input folder exists
    if not os.path.isdir(input_folder):
        print(f"Error: Input folder '{input_folder}' does not exist.")
        sys.exit(1)

    try:
        batch_convert(input_folder, output_folder)
    except KeyboardInterrupt:
        print("\nConversion interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"Error during conversion: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()