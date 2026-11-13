import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Check, 
  CheckCheck, 
  Sparkles, 
  Paperclip, 
  MapPin, 
  Clock, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { Conversation, ChatMessage } from '../types';
import { soundManager } from '../utils/audio';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, text: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputText.trim() || !activeConv) return;
    const textToSend = inputText.trim();
    setInputText('');
    onSendMessage(activeConv.id, textToSend);

    // Simulated instant/smart host response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        '¡Perfecto! Hemos tomado nota de tu consulta. Tu comodidad es nuestra prioridad.',
        'Totalmente coordinado. Te esperaremos puntualmente en la entrada principal del alojamiento.',
        '¡Genial! Si necesitas el transfer privado hacia el alojamiento, puedes solicitarlo directamente en la pestaña de Transporte.',
        'La clave de la cerradura digital inteligente se activará el día de tu llegada a las 14:00.',
        '¡Sin problema! Dejamos toallas adicionales y café de bienvenida listo para ustedes.'
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      onSendMessage(activeConv.id, randomResponse);
      soundManager.playChime();
    }, 1800);
  };

  const handleQuickQuestion = (question: string) => {
    if (!activeConv) return;
    onSendMessage(activeConv.id, question);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let reply = '¡Con mucho gusto! Confirmado.';
      if (question.includes('temprano')) {
        reply = 'Hemos verificado el calendario: podemos coordinar tu early check-in a partir de las 12:30 sin recargo adicional.';
      } else if (question.includes('cerradura') || question.includes('clave')) {
        reply = 'El código temporal para la puerta inteligente es 4921#. Se activa 10 minutos antes de tu hora de llegada.';
      } else if (question.includes('transfer') || question.includes('aeropuerto')) {
        reply = 'Sí, nuestro conductor asociado puede recogerlos en la terminal de llegadas. Puedes reservarlo en la sección "Transporte Privado".';
      }
      onSendMessage(activeConv.id, reply);
      soundManager.playChime();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-transform animate-in slide-in-from-right duration-200"
      >
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Cerrar chat"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {activeConv && (
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={activeConv.otherParty.avatar}
                    alt={activeConv.otherParty.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {activeConv.otherParty.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                    {activeConv.propertyTitle}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body: Conversation selector (if multiple) & message flow */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Messages Flow */}
          <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-slate-950/40">
            
            {/* Quick Context Strip */}
            {activeConv && (
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Chat Seguro &amp; Encriptado
                </span>
                <span className="truncate max-w-[200px] text-[11px] text-slate-400">
                  Reserva activa
                </span>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeConv?.messages.map((msg) => {
                const isMe = !msg.isHost;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-slate-900 text-white dark:bg-emerald-600 rounded-br-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                      <span>{msg.timestamp}</span>
                      {isMe && (
                        <CheckCheck className="w-3 h-3 text-emerald-500 inline" />
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 italic p-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>{activeConv?.otherParty.name} está escribiendo...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  '¿A qué hora es el check-in?',
                  'Solicitar early check-in',
                  '¿Coordinan transfer desde aeropuerto?',
                  'Clave de cerradura digital'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(chip)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap text-[11px] transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe un mensaje al anfitrión..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white disabled:opacity-40 transition-all shadow-xs"
                aria-label="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
