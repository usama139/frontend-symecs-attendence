import React from 'react';
import { ChatWidget } from 'pluginai-react';

const Chatbot = () => {
  const apiKey = import.meta.env.VITE_RAGFLOW_API_KEY || 'rag_sk_57dc3f606e0b2df89366bf43f770afd9';
  const workspace = import.meta.env.VITE_PLUGINAI_WORKSPACE || '';

  return (
    <ChatWidget 
      apiKey={apiKey} 
      workspace={workspace} 
    />
  );
};

export default Chatbot;

