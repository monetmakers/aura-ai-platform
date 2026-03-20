import { AgentConfig } from "../AgentConfig";

export default function AgentConfigExample() {
  return <AgentConfig agentName="Support Bot" onConfigChange={(c) => console.log("Config:", c)} />;
}
