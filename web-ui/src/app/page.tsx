import MessageChannelList from "@/components/message-channel/message-channel-list.component";
import MainLayout from "@/components/layout/main-layout.component";
import BotListComponent from "@/components/bot/bot-list.component";

export default function HomePage() {
  return (
    <MainLayout title="Message Channels">
      <MessageChannelList />
      <BotListComponent />
    </MainLayout>
  );
}
