import { ChatPlayground } from "../ChatPlayground";

export default function ChatPlaygroundExample() {
  return <ChatPlayground agentName="Support Bot" onFixResponse={(id) => console.log("Fix response:", id)} />;
}
