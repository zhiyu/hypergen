import React, { useState, useEffect } from "react";
import { Container, Box, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { generateReport, pingAPI } from "../utils/api";

import { Button, Input, Textarea, Tooltip } from "@heroui/react";
import { Select, SelectItem, SelectSection } from "@heroui/react";
import { Alert } from "@heroui/react";
import { Switch, cn } from "@heroui/react";

import { PiWarningCircle, PiKey, PiMagicWand } from "react-icons/pi";

import defaultProviders from "../config/models";

// Example prompts for story generation
const examplePrompts = [
  "长文本写作AI智能体的商业价值是什么？撰写一份详细的分析报告。",
  "撰写一份关于人工智能对医疗保健影响的综合报告，重点分析其在诊断、治疗规划和患者预后方面的作用。",
  "撰写一份关于发展中国家可持续能源解决方案的详细报告，包括其经济可行性和环境影响。",
];

const StoryGenerationPage = () => {
  const [providers] = useState(
    JSON.parse(localStorage.getItem("providers")) || defaultProviders
  );

  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("claude-3-7-sonnet-20250219");
  const [enableSearch, setEnableSearch] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem("openai_api_key") || "",
    claude: localStorage.getItem("claude_api_key") || "",
    gemini: localStorage.getItem("gemini_api_key") || "",
    qwen: localStorage.getItem("qwen_api_key") || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const navigate = useNavigate();

  // Save API keys to localStorage when they change
  useEffect(() => {
    if (apiKeys.openai) localStorage.setItem("openai_api_key", apiKeys.openai);
    if (apiKeys.claude) localStorage.setItem("claude_api_key", apiKeys.claude);
    if (apiKeys.gemini) localStorage.setItem("gemini_api_key", apiKeys.gemini);
    if (apiKeys.qwen) localStorage.setItem("qwen_api_key", apiKeys.qwen);
  }, [apiKeys]);

  // Check if API is available on component mount
  useEffect(() => {
    async function checkAPIConnection() {
      try {
        await pingAPI();
        // API is available, nothing to do
      } catch (err) {
        setError(
          "Cannot connect to the backend server. Please make sure it is running at http://localhost:" +
            (process.env.REACT_APP_BACKEND_PORT || "5001") +
            "."
        );
      }
    }

    checkAPIConnection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt) {
      setError("Please provide a prompt for story generation.");
      return;
    }

    // Check if the appropriate API key is provided
    const isOpenAIModel = model.toLowerCase().includes("gpt");
    const isClaudeModel = model.toLowerCase().includes("claude");
    const isGeminiModel = model.toLowerCase().includes("gemini");
    const isQwenModel = model.toLowerCase().includes("qwen");

    if (isOpenAIModel && !apiKeys.openai) {
      setError("请在设置部分填写您的 OpenAI API 密钥。");
      return;
    }

    if (isClaudeModel && !apiKeys.claude) {
      setError("请在设置部分填写您的 Anthropic Claude API 密钥。");
      return;
    }

    if (isGeminiModel && !apiKeys.gemini) {
      setError("请在设置部分填写您的 Google Gemini API 密钥。");
      return;
    }

    if (isQwenModel && !apiKeys.qwen) {
      setError("请在设置部分填写您的 QWen API 密钥。");
      return;
    }

    // First, check if the server is reachable
    try {
      await pingAPI();
    } catch (err) {
      setError(
        "Cannot connect to the backend server. Please make sure it is running at http://localhost:" +
          (process.env.REACT_APP_BACKEND_PORT || "5001") +
          "."
      );
      return;
    }

    setLoading(true);
    setError("");
    setStatusMessage("Initiating generation...");
    setShowStatus(true);

    try {
      // Call the backend API to start story generation
      const response = await generateReport({
        prompt,
        model,
        enableSearch,
        apiKeys: {
          openai: apiKeys.openai,
          claude: apiKeys.claude,
          gemini: apiKeys.gemini,
          qwen: apiKeys.qwen,
        },
      });

      // Navigate to the results page with the task ID
      if (response && response.taskId) {
        setStatusMessage("Generation started successfully!");
        navigate(`/results/${response.taskId}`, {
          state: {
            taskId: response.taskId,
            prompt,
            model,
            type: "story",
            status: "generating",
          },
        });
      } else {
        throw new Error("No task ID returned from the server");
      }
    } catch (err) {
      setLoading(false);
      setStatusMessage("");
      setError(
        "Error starting story generation: " + (err.message || "Unknown error")
      );
      console.error("Story generation error:", err);
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <div className="text-2xl mb-1 font-medium">报告生成</div>
        <div className="text-sm">
          使用我们的异构递归规划框架生成完整的报告​​。该系统整合信息检索、逻辑推理与内容编排功能，自动生成结构严谨、信息丰富的专业报告。
        </div>
      </Box>

      <Snackbar
        open={showStatus}
        autoHideDuration={6000}
        onClose={() => setShowStatus(false)}
        message={statusMessage}
      />

      <Box sx={{ mb: 6 }}>
        <form onSubmit={handleSubmit}>
          <Textarea
            key="faded"
            className="mb-4 text-xl"
            label=""
            startContent={
              <Tooltip
                closeDelay={200}
                content={
                  <div className="text-sm p-4">
                    <div className="mb-1">随机生成提示词</div>
                  </div>
                }
              >
                <Button
                  isIconOnly
                  className="mr-4"
                  variant="light"
                  onPress={() =>
                    handleExampleClick(
                      examplePrompts[Math.floor(Math.random() * 10) % 3]
                    )
                  }
                >
                  <PiMagicWand size="16" />
                </Button>
              </Tooltip>
            }
            labelPlacement="outside"
            placeholder="描述你想要生成的故事..."
            variant="faded"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            minRows="10"
            isClearable
            onClear={() => setPrompt("")}
            size="lg"
          />

          <div className="mb-4 text-sm">
            <div className="flex items-center font-medium mb-2">
              <PiWarningCircle className="mr-1" />
              <Tooltip
                closeDelay={200}
                content={
                  <div className="text-sm p-4">
                    <div className="mb-1">
                      明确范围​​，清晰界定报告的覆盖范围与核心焦点，确保内容精准匹配您的需求。
                    </div>
                    <div className="mb-1">
                      声明结构​​，若对报告框架或章节有特定要求，请在需求中明确提出。
                    </div>
                    <div>
                      指定深度​​，注明您需要的是概要性综述，还是包含技术细节与文献引用的深度分析。
                    </div>
                  </div>
                }
              >
                高效报告创作提示词技巧
              </Tooltip>
            </div>
          </div>

          <Select
            className="mb-8"
            label="选择模型"
            placeholder="请选择一个模型"
            variant="underlined"
            size="lg"
            onChange={(e) => {
              setModel(e.target.value);
            }}
          >
            {providers.map((provider) => (
              <SelectSection
                showDivider
                title={provider.name}
                classNames={{ heading: "text-xs" }}
              >
                {provider.models.map((model) => (
                  <SelectItem key={model.value}>{model.name}</SelectItem>
                ))}
              </SelectSection>
            ))}
          </Select>

          <Switch
            classNames={{
              base: cn(
                "inline-flex flex-row-reverse w-full max-w items-center",
                "justify-between cursor-pointer rounded-lg gap-2 p-0 mb-8",
                "data-[selected=true]:border-primary"
              ),
              wrapper: "p-0 h-4 overflow-visible",
              thumb: cn(
                "w-6 h-6 border-2 shadow-lg",
                "group-data-[hover=true]:border-primary",
                //selected
                "group-data-[selected=true]:ms-6",
                // pressed
                "group-data-[pressed=true]:w-7",
                "group-data-[selected]:group-data-[pressed]:ms-4"
              ),
            }}
            onValueChange={(isSelected) => setEnableSearch(isSelected)}
          >
            <div className="flex flex-col gap-1">
              <p className="text-medium">启用搜索</p>
              <p className="text-tiny text-default-400">
                启用搜索功能将帮助你获取更多相关网络信息，从而提高报告的质量和深度。
              </p>
            </div>
          </Switch>

          <Button
            className="mb-8 w-full bg-gradient-to-tr from-pink-600 to-amber-300 text-white shadow-lg"
            radius="sm"
            isLoading={loading}
            isDisabled={loading || !prompt}
            type="submit"
            size="lg"
          >
            开始生成
          </Button>

          {error && (
            <Alert
              hideIconWrapper
              color="warning"
              title={error}
              className="mb-8"
            />
          )}
        </form>
      </Box>
    </Container>
  );
};

export default StoryGenerationPage;
