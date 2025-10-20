'use client';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Message board state
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messageBoard, setMessageBoard] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [messageBoardStatus, setMessageBoardStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  const [submittingMessage, setSubmittingMessage] = useState(false);

  useEffect(() => {
    // Trigger animations with a slight delay for smooth loading
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Load messages from the API
    loadMessages();

    return () => clearTimeout(timer);
  }, []);

  // Function to load messages from the API
  const loadMessages = async () => {
    try {
      setLoadingMessages(true);
      const response = await fetch('/api/messages');
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
      } else {
        console.error('Failed to load messages:', data.error);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleMessageBoardChange = (e) => {
    const { name, value } = e.target;
    setMessageBoard(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle message board submission
  const handleMessageBoardSubmit = async (e) => {
    e.preventDefault();
    setSubmittingMessage(true);
    setMessageBoardStatus({
      submitted: false,
      success: false,
      message: ''
    });

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageBoard),
      });

      const data = await response.json();

      if (data.success) {
        // Reset form and show success message
        setMessageBoard({
          name: '',
          email: '',
          message: ''
        });

        setMessageBoardStatus({
          submitted: true,
          success: true,
          message: 'Your message has been posted successfully!'
        });

        // Refresh messages
        loadMessages();
      } else {
        // Show error message
        const errorMessage = data.errors
          ? data.errors.join(', ')
          : data.error || 'Failed to post message';

        setMessageBoardStatus({
          submitted: true,
          success: false,
          message: errorMessage
        });
      }
    } catch (error) {
      console.error('Error posting message:', error);
      setMessageBoardStatus({
        submitted: true,
        success: false,
        message: 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      setSubmittingMessage(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background decorative elements - matching skills page */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <h1 className={`text-4xl md:text-6xl font-light mb-6 bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Get in <span className="font-bold">Touch</span>
          </h1>
          <p className={`text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your vision
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Message Board Section */}
          <div className={`mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <h3 className="text-left font-light text-2xl bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
                  Community Messages
                </h3>
              </div>

              {/* Message Display */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-700 mb-4">Recent Messages</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto p-1">
                  {loadingMessages ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No messages yet. Be the first to leave a message!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors duration-300">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-800">{msg.name}</h5>
                          <span className="text-xs text-gray-500">{formatDate(msg.createdAt)}</span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-line">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Message Form */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-700 mb-4">Leave a Message</h4>

                {/* Status messages */}
                {messageBoardStatus.submitted && (
                  <div className={`mb-6 p-4 rounded-lg ${messageBoardStatus.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {messageBoardStatus.message}
                  </div>
                )}

                <form onSubmit={handleMessageBoardSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="mb-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="mb-name"
                        name="name"
                        value={messageBoard.name}
                        onChange={handleMessageBoardChange}
                        placeholder="Your Name (2-50 characters)"
                        required
                        minLength={2}
                        maxLength={50}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="mb-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="mb-email"
                        name="email"
                        value={messageBoard.email}
                        onChange={handleMessageBoardChange}
                        placeholder="Your Email (not displayed publicly)"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="mb-message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="mb-message"
                      name="message"
                      value={messageBoard.message}
                      onChange={handleMessageBoardChange}
                      placeholder="Your message (10-500 characters)"
                      required
                      minLength={10}
                      maxLength={500}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                    ></textarea>
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {messageBoard.message.length}/500
                    </div>
                  </div>
                  <div>
                    <Button
                      type="submit"
                      disabled={submittingMessage}
                      className="px-6 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {submittingMessage ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Posting...
                        </div>
                      ) : (
                        'Post Message'
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Note: Messages are public and will be automatically deleted after 3 days. You can post one message per 3 days.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Combined Contact Info and Connect Section */}
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <h3 className="text-left font-light text-2xl bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
                  Contact & Connect
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                      <a href="mailto:chanchuntat1@gmail.com" className="text-blue-600 hover:underline">chanchuntat1@gmail.com</a>
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">LinkedIn</h4>
                      <a href="https://www.linkedin.com/in/vincentcct/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">linkedin.com/in/vincentcct/</a>
                    </div>
                  </div>

                  {/* GitHub */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">GitHub</h4>
                      <a href="https://github.com/Vincent0009" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">github.com/Vincent0009</a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Location</h4>
                      <p className="text-gray-600">Taipei, Taiwan</p>
                    </div>
                  </div>
                </div>

                {/* Connect Section */}
                <div className="flex flex-col justify-center">
                  <p className="text-gray-600 mb-6">
                    I&apos;m currently available for freelance work, collaborations, and interesting projects.
                    If you have a project that you want to get started, think you need my help with something,
                    or just want to say hello, then get in touch.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {/* Social Media Links */}
                    <a
                      href="https://www.linkedin.com/in/vincentcct/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>

                    <a
                      href="https://github.com/Vincent0009"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-800 rounded-full hover:bg-gray-100 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                      GitHub
                    </a>

                    {/* <a
                      href="https://twitter.com/yourusername"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      Twitter
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}