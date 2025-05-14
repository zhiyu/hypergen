import React, { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { generateReport, pingAPI } from "../utils/api";

import { Tabs, Tab, Card, CardBody, Switch } from "@heroui/react";
import { Accordion, AccordionItem, Chip } from "@heroui/react";
import { Button, Input, Textarea, Tooltip } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { Alert } from "@heroui/react";

import { PiWarningCircle, PiKey, PiMagicWand, PiBrain } from "react-icons/pi";

// Recommended model options
const commonModels = [
  { label: "QWen Turbo", value: "qwen-turbo" },
  {
    label: "Claude 3.7 Sonnet (Recommended)",
    value: "claude-3-7-sonnet-20250219",
  },
  { label: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20241022" },
  { label: "GPT-4o", value: "gpt-4o" },
  { label: "GPT-4o-mini", value: "gpt-4o-mini" },
  { label: "Gemini 2.5 Pro Exp", value: "gemini-2.5-pro-exp-03-25" },
  { label: "Gemini 2.5 Pro Preview", value: "gemini-2.5-pro-preview-03-25" },
];

const SettingsPage = () => {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("claude-3-7-sonnet-20250219");
  const [enableSearch, setEnableSearch] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem("openai_api_key") || "",
    claude: localStorage.getItem("claude_api_key") || "",
    gemini: localStorage.getItem("gemini_api_key") || "",
    qwen: localStorage.getItem("qwen_api_key") || "",
  });
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showClaudeKey, setShowClaudeKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showQwenKey, setShowQwenKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (apiKeys.openai) localStorage.setItem("openai_api_key", apiKeys.openai);
    if (apiKeys.claude) localStorage.setItem("claude_api_key", apiKeys.claude);
    if (apiKeys.gemini) localStorage.setItem("gemini_api_key", apiKeys.gemini);
    if (apiKeys.qwen) localStorage.setItem("qwen_api_key", apiKeys.qwen);
  }, [apiKeys]);

  useEffect(() => {}, []);

  const handleApiKeyChange = (provider, value) => {
    console.log(value);
    setApiKeys((prev) => ({
      ...prev,
      [provider]: value,
    }));
  };

  const EyeSlashFilledIcon = (props) => {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
      >
        <path
          d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
          fill="currentColor"
        />
        <path
          d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
          fill="currentColor"
        />
        <path
          d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
          fill="currentColor"
        />
        <path
          d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
          fill="currentColor"
        />
        <path
          d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
          fill="currentColor"
        />
      </svg>
    );
  };

  const EyeFilledIcon = (props) => {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        {...props}
      >
        <path
          d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
          fill="currentColor"
        />
        <path
          d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
          fill="currentColor"
        />
      </svg>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <div className="text-2xl mb-1 font-medium">设置</div>
        <div className="text-sm">
          管理模型和服务商。您的模型配置和API密钥信息会安全存储在浏览器的本地存储中。
        </div>
      </Box>

      <div>
        <Accordion
          variant="splitted"
          className="px-0"
          itemClasses={{ base: "mb-2" }}
        >
          <AccordionItem
            key="1"
            aria-label="模型"
            title="模型"
            startContent={<PiBrain size={16} />}
          >
            <div class="grid grid-cols-1 gap-8 mb-6">
              <div>
                <Input
                  className="w-full"
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                    >
                      {!showOpenAIKey ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  onChange={(e) => handleApiKeyChange("openai", e.target.value)}
                  label="OpenAI API Key"
                  placeholder="请输入OpenAI API Key"
                  type={showOpenAIKey ? "text" : "password"}
                  size="lg"
                  variant="bordered"
                  value={apiKeys.openai}
                  description=""
                />
              </div>
              <div>
                <Input
                  className="w-full"
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShowClaudeKey(!showClaudeKey)}
                    >
                      {!showClaudeKey ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  onChange={(e) => handleApiKeyChange("claude", e.target.value)}
                  label="Anthropic API Key"
                  placeholder="请输入 Anthropic API Key"
                  type={showClaudeKey ? "text" : "password"}
                  size="lg"
                  variant="bordered"
                  value={apiKeys.claude}
                  description=""
                />
              </div>
              <div>
                <Input
                  className="w-full"
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                    >
                      {!showGeminiKey ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  onChange={(e) => handleApiKeyChange("gemini", e.target.value)}
                  label="Google Gemini API Key"
                  placeholder="请输入 Google Gemini API Key"
                  type={showGeminiKey ? "text" : "password"}
                  size="lg"
                  variant="bordered"
                  value={apiKeys.gemini}
                  description=""
                />
              </div>
              <div>
                <Input
                  className="w-full"
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShowQwenKey(!showQwenKey)}
                    >
                      {!showQwenKey ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  onChange={(e) => handleApiKeyChange("qwen", e.target.value)}
                  label="QWen Key"
                  placeholder="请输入 QWen Key"
                  type={showQwenKey ? "text" : "password"}
                  size="lg"
                  variant="bordered"
                  value={apiKeys.qwen}
                  description=""
                />
              </div>
            </div>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="服务商"
            title="服务商"
            startContent={<PiKey size={16} />}
          >
            <div class="grid grid-cols-1 gap-8 mb-2">
              <div>
                <Input
                  className="w-full"
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                    >
                      {!showOpenAIKey ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  onChange={(e) => handleApiKeyChange("openai", e.target.value)}
                  label="OpenAI API Key"
                  placeholder="请输入OpenAI API Key"
                  type={showOpenAIKey ? "text" : "password"}
                  size="lg"
                  variant="bordered"
                  value={apiKeys.openai}
                  description=""
                />
              </div>
              <div>
                <Input
                  className="w-full"
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShowClaudeKey(!showClaudeKey)}
                    >
                      {!showClaudeKey ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  onChange={(e) => handleApiKeyChange("claude", e.target.value)}
                  label="Anthropic API Key"
                  placeholder="请输入 Anthropic API Key"
                  type={showClaudeKey ? "text" : "password"}
                  size="lg"
                  variant="bordered"
                  value={apiKeys.claude}
                  description=""
                />
              </div>
              <div>
                <Input
                  className="w-full"
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                    >
                      {!showGeminiKey ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  onChange={(e) => handleApiKeyChange("gemini", e.target.value)}
                  label="Google Gemini API Key"
                  placeholder="请输入 Google Gemini API Key"
                  type={showGeminiKey ? "text" : "password"}
                  size="lg"
                  variant="bordered"
                  value={apiKeys.gemini}
                  description=""
                />
              </div>
              <div>
                <Input
                  className="w-full"
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={() => setShowQwenKey(!showQwenKey)}
                    >
                      {!showQwenKey ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  onChange={(e) => handleApiKeyChange("qwen", e.target.value)}
                  label="QWen Key"
                  placeholder="请输入 QWen Key"
                  type={showQwenKey ? "text" : "password"}
                  size="lg"
                  variant="bordered"
                  value={apiKeys.qwen}
                  description=""
                />
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </Container>
  );
};

export default SettingsPage;
