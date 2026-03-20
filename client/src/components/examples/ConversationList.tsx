import { ConversationList } from "../ConversationList";

export default function ConversationListExample() {
  return <ConversationList onSelectConversation={(id) => console.log("Selected:", id)} />;
}
