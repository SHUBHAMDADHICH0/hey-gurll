import { useState, useEffect } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SecretMessage {
  id: string;
  message: string;
  sender_name: string | null;
  created_at: string;
}

const SecretMessages = () => {
  const [messages, setMessages] = useState<SecretMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("secret_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setMessages(data);
    setLoading(false);
  };

  const handleSend = async () => {
    const trimmedMsg = newMessage.trim();
    if (!trimmedMsg) return;
    if (trimmedMsg.length > 500) {
      toast.error("Message 500 characters se chhota hona chahiye!");
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      toast.error("Secret messages are temporarily unavailable.");
      return;
    }

    setSending(true);
    const { error } = await supabase.from("secret_messages").insert({
      message: trimmedMsg,
      sender_name: senderName.trim().slice(0, 50) || null,
    });

    if (error) {
      toast.error("Message send nahi ho paya 😢");
    } else {
      toast.success("Secret message sent! 💌");
      setNewMessage("");
      setSenderName("");
      fetchMessages();
    }
    setSending(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-10 px-4">
      {/* Send a secret message */}
      <div className="luxury-card-highlight p-6 md:p-8 mb-6">
        <p className="text-xl md:text-2xl font-bold luxury-text-gradient mb-4">
          💌 Secret Message Bhejo
        </p>
        <div className="luxury-divider" />
        <input
          type="text"
          placeholder="Tera naam (optional)"
          aria-label="Your name, optional"
          disabled={!isSupabaseConfigured}
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          maxLength={50}
          className="w-full mb-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-pink-400/50 transition-colors"
        />
        <textarea
          placeholder="Apna secret message likh yaha… 🤫"
          aria-label="Your secret message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          maxLength={500}
          rows={3}
          disabled={!isSupabaseConfigured}
          className="w-full mb-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-pink-400/50 transition-colors resize-none"
        />
        <button
          onClick={handleSend}
          disabled={sending || !newMessage.trim() || !isSupabaseConfigured}
          className="luxury-btn-yes w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {sending ? "Sending… ✨" : "Send Secret Message 💌"}
        </button>
      </div>

      {/* Show saved messages */}
      <div className="luxury-card p-6 md:p-8">
        <p className="text-lg md:text-xl font-bold luxury-text-gradient mb-4">
          📬 Secret Messages
        </p>
        <div className="luxury-divider" />

        {!isSupabaseConfigured ? (
          <p role="status" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            Secret messages are paused because Supabase credentials are not available in this environment.
          </p>
        ) : loading ? (
          <p className="text-white/40 text-center italic">Loading… ✨</p>
        ) : messages.length === 0 ? (
          <p className="text-white/40 text-center italic">
            Koi secret message nahi hai abhi… pehla tu bhej! 🤫
          </p>
        ) : null}
        </div>
    </div>
  );
};

export default SecretMessages;
