const defaultSettings = {
  providers: [
    {
      name: "QWen",
      icon: "/icons/qwen",
      apikey: "",
      models: [
        { name: "QWen Turbo", value: "qwen-turbo", enabled: true },
        { name: "QWen Plus", value: "qwen-plus", enabled: true },
      ],
      reserved: true,
    },
    {
      name: "DeepSeek",
      icon: "/icons/deepseek",
      apikey: "",
      models: [
        { name: "DeepSeek Chat", value: "deepseek-chat", enabled: true },
        {
          name: "DeepSeek Reasoner",
          value: "deepseek-reasoner",
          enabled: true,
        },
      ],
      reserved: true,
    },
    {
      name: "OpenAI",
      icon: "/icons/openai",
      apikey: "",
      models: [{ name: "GPT-4o", value: "gpt-4o", enabled: true }],
      reserved: true,
    },
    {
      name: "Anthropic",
      icon: "/icons/claude",
      apikey: "",
      models: [
        {
          name: "Claude 3.7 Sonnet",
          value: "claude-3-7-sonnet-20250219",
          enabled: true,
        },
        {
          name: "Claude 3.5 Sonnet",
          value: "claude-3-5-sonnet-20241022",
          enabled: true,
        },
      ],
      reserved: true,
    },
    {
      name: "Gemini",
      icon: "/icons/gemini",
      apikey: "",
      models: [
        {
          name: "Gemini 2.5 Pro Exp",
          value: "gemini-2.5-pro-exp-03-25",
          enabled: true,
        },
        {
          name: "Gemini 2.5 Pro Preview",
          value: "gemini-2.5-pro-preview-03-25",
          enabled: true,
        },
      ],
      reserved: true,
    },
    {
      name: "Grok",
      icon: "/icons/grok",
      apikey: "",
      models: [
        {
          name: "Grok Beta",
          value: "grok-beta",
          enabled: true,
        },
        {
          name: "Grok Vision Beta",
          value: "grok-vision-beta",
          enabled: true,
        },
      ],
      reserved: true,
    },
  ],
  searchProviders: [
    {
      name: "Searxng",
      icon: "/icons/searxng",
      apikey: "",
      apihost: "http://127.0.0.1:8080",
      engines: [
        { name: "Google", value: "google", enabled: true },
        { name: "Bing", value: "bing", enabled: true },
      ],
      reserved: true,
    },
    {
      name: "SerpApi",
      icon: "/icons/serpapi",
      apikey: "",
      engines: [
        { name: "Google", value: "google", enabled: true },
        { name: "Bing", value: "bing", enabled: true },
      ],
      reserved: true,
    },
  ],
};

export default defaultSettings;
