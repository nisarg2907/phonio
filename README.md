## Getting Started

### Prerequisites

1. Make sure you have [Node.js](https://nodejs.org/) installed.
2. Create a LiveKit account and obtain your API key , secret and the web socket url.

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:nisarg2907/phonio.git
   cd phonio
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Create a `.env` file in the root of your project.
   - Copy the contents of `.env.example` into `.env`.
   - Replace the placeholder values with your actual LiveKit API key, secret, and URLs.

   ```env
   LIVEKIT_API_KEY=your_livekit_api_key
   LIVEKIT_API_SECRET=your_livekit_api_secret
   NEXT_PUBLIC_LIVEKIT_URL=your_next_public_livekit_url
   NEXT_PUBLIC_DOMAIN_URL=http://localhost:3000 # or your published server URL
   ```

### Running the Development Server

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
