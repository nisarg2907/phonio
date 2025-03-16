import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import JoinCallButton from '@/components/VideoCall/JoinCallButton';
import { serverBuildTimeLogger } from '@/utils/logger';

export default function Home() {
  serverBuildTimeLogger();
  
  return (
    <main className="main-container">
      <Header />
      <div className="content-wrapper">
        <Hero />
        <JoinCallButton />
      </div>
    </main>
  );
}

export const revalidate = 60 * 60 * 5; 