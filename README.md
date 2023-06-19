# InterView InSight

InterView InSight is an AI platform that allows users to practice their presentation skills. 


![Interface](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/511/055/datas/gallery.jpg)

## Description

A lot of present-day EdTech AI tools and general AI tools (like GitHub Copilot and ChatGPT) give you tutoring and answers with minimal cognitive effort from the learner. Unfortunately, such solutions aren't the best for long-term retention and understanding of information. We wanted to make an AI tool to go the other way around: given knowledge you weren't familiar with, the tool would help you learn that information.

🧑‍🎓 Scientific studies have shown that teaching concepts you've learned to others is one of the best pathways towards information retention, so we designed a backend using Hume AI and GPT to create a simulated AI learner which asks learners questions to help them explore deeper into the fields in their readings and homework assignments. Based on emotional cues from the learner's voice and video, as well as the reasoning in the learner's discussion, GPT will automatically generate incisive questions to improve the learner's understanding of the subject.

🧑‍🏫 As a plus, this platform is also easily usable by people like us, who TA and tutor classes. Our platform can be tuned to tutor different personalities of people and try out content destined for labs and sections, helping both teachers and students alike get the most out of their learning. With nearly 77 million students in US schools alone, and more than 614 million worldwide, we envision our platform equitably improving the lives of almost everyone in the next generation.

![Interview Practice](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/511/051/datas/gallery.jpg)


## Additional Functionality 

⚖️ It turns out that teaching an AI about things can be useful in other areas as well. For underrepresented minorities in computer science, AI can help automatically prepare students for interviews, helping remove one structural barrier to equity in CS (as of today, only a fifth of CS graduates are URMs).

![Teaching](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/511/053/datas/gallery.jpg)

🦆 In the CS industry, our AI can serve as a rubber duck for debugging and ask questions about unfamiliar code, helping people adapt to new codebases more quickly. This is a must given the 35 days normally needed for a new engineer to get accustomed to a codebase.

🎤 Some of our group have historically struggled with public speaking, a fear shared by 15 million people worldwide: Hume AI's video and audio feedback and automated GPT-powered reasoned feedback can help dissipate this fear.

🔄One last small, but niche application of our AI is startup pitches, a feature eagerly demanded by one of the people we interviewed before building our product in earnest. For a founder, pitching to a venture capitalist can be one of the most nerve-wracking and important moments of their lives, and those without existing privilege and connections are structurally disadvantaged. We're proud to report that we've tested pitching our own project, on our own project, and we're excited to do it in real life as well!

![Pitch Practice](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/511/052/datas/gallery.jpg)

## Technologies Used

We kept it simple: The site was primarily built with React and Next.js, hosted on Vercel, with Tailwind for CSS. 🌟

We used OpenAI's Whisper API to convert streamed audio from computer into text in batches. We used Hume AI's vocal prosody API to gather emotions from streamed audio. We used Hume AI's facial recognition API to gather emotions from facial features. We used Websockets to connect to Hume's streaming APIs.

We used OpenAI's gpt-3.5-turbo-16k to take in timestamped emotions and streamed audio, reason on these audio, and produce questions and further feedback and criticism to users.

## Challenges We Ran Into
<ul>
<li>It was difficult for us to debug ChatGPT API errors since it was his first time using this tech stack. </li>
<li>We also had trouble sending audio data from the frontend to the backend. </li>
<li> We implemented Hume AI video support using a canvas hack before the actual Hume workshop where they revealed a much less hacky solution. The technical debt really bit into us.</li>
<li> It was our first time for some of us working on React, but we learned in only six hours.</li>
<li>It was difficult to judge when our audio files were too big to chunk. We split our audio into small intervals to avoid this and made piecemeal calls to OpenAI. </li>
</ul>

## Accomplishments that We're Proud of

<ul> 
<li> Rapidly incorporating many different modes (job interview, tutoring practice, pitch practice) and customizability into our platform</li>
<li> Figuring out how to integrate all APIs and make some snazzy timeline charts for them. </li>
<li>Creating a secret relationship coach prompt to help us with our love lives :P</li>
<li> Pitching our own AI to our own AI and hearing it critique our own ideas, helping us make it better. </li>
</ul>

## What's Next For InterView InSight

<ul>
<li>Incorporating text to audio (using Google APIs) for Chat GPT's responses to improve user accessibility.</li>
<li>Keeping a log of practice session responses to refer back to later to improve presentation skills (MongoDB).</li>
<li>Create a community of people sharing modalities and prompting on our site.</li>
<li>Work on integrating scientific data (fMRI, EEG) which can inform education into our overall education site pipeline. </li>
</ul>

![InterView InSight](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/511/054/datas/gallery.jpg)

## How to Install and Run the Project

1. Clone the project repository to your local machine.
2. Install dependencies using `npm install` or `yarn install`.
3. Include a `.env.local` file and add the variables `NEXT_PUBLIC_HUME_API_KEY` and `OPENAI_API_KEY` with their respective API keys.
4. Run the development server using `next build` and `next start` in the command line.


## Authors

Andy Tang, Darlnim Park, Mehul Gandhi

* [Andy Tang](https://devpost.com/winterwind2022)
* [Darlnim Park](https://devpost.com/dpark00)
* [Mehul Gandhi](https://devpost.com/gandhi854)

## Acknowledgments

Devpost submission, APIs
* [Devpost Submission](https://devpost.com/software/interview-insight?ref_content=user-portfolio&ref_feature=in_progress)
* [Google Cloud Text-to-Speech](https://console.cloud.google.com/apis/library/texttospeech.googleapis.com)
* [OpenAI API](https://platform.openai.com/docs/introduction)
* [Whisper API](https://openai.com/research/whisper)
* [WebSocket](https://socket.io/docs/v4/)
