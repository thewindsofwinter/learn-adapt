import openai
import os 

openai.api_key = "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"
def convert(path):
    """Returns the text in an audio file as a json file."""
    audio_file = open(path, "rb")
    transcript = openai.Audio.transcribe("whisper-1", audio_file)
    return transcript

convert("./audios/hello.mp3")