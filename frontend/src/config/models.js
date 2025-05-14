const defaultProviders = [
  {
    name: "OpenAI",
    apikey: "",
    apihost: "",
    models: [{ name: "GPT-4o", value: "gpt-4o", enabled: true }],
  },
  {
    name: "Anthropic",
    apikey: "",
    apihost: "",
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
  },
  {
    name: "Gemini",
    apikey: "",
    apihost: "",
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
  },
  {
    name: "通义千问",
    apikey: "",
    apihost: "",
    models: [
      { name: "QWen Turbo", value: "qwen-turbo", enabled: true },
      { name: "QWen Plus", value: "qwen-plus", enabled: true },
    ],
  },
];

export default defaultProviders;
