'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Bot as BotIcon } from 'lucide-react';
import styles from './ChatInterface.module.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'System initialized. I am analyzing the pipeline. How can I assist you?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, history: messages })
            });

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className={styles.chatContainer}>
            <div className={styles.messages}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`${styles.messageRow} ${msg.role === 'user' ? styles.userRow : styles.assistantRow}`}>
                        <div className={styles.avatar}>
                            {msg.role === 'user' ? <UserIcon size={16} /> : <BotIcon size={16} />}
                        </div>
                        <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.assistantBubble}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className={styles.messageRow}>
                        <div className={styles.avatar}><BotIcon size={16} /></div>
                        <div className={styles.typingIndicator}>Thinking...</div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className={styles.inputArea}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask Gemini to analyze leads or optimize outreach..."
                    className={styles.input}
                    disabled={loading}
                />
                <button onClick={sendMessage} disabled={loading} className={styles.sendButton}>
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
