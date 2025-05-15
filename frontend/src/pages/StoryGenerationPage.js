import React, { useState, useEffect } from "react";
import { Container, Box, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { generateStory, pingAPI } from "../utils/api";

import { Button, Input, Textarea, Tooltip } from "@heroui/react";
import { Select, SelectItem, SelectSection } from "@heroui/react";
import { Alert } from "@heroui/react";

import { PiWarningCircle, PiKey, PiMagicWand } from "react-icons/pi";

import defaultSettings from "../config/models";

// Example prompts for story generation
const examplePrompts = [
  "创作一个关于太阳没有升起的故事。以第三人称视角讲述，包含一个正在户外玩耍的女孩目睹太阳消失的情节。",
  "写一篇关于人类首个火星殖民地意外发现行星地表下秘密的科幻小说。",
  "写一个发生在海滨小镇的悬疑故事，每逢满月就会发生诡异现象。主角是一位持怀疑态度的记者，正在调查这些事件。",
];

const StoryGenerationPage = () => {
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem("settings")) || defaultSettings
  );

  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("claude-3-7-sonnet-20250219");
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
      const response = await generateStory({
        prompt,
        model,
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
        <div className="text-2xl mb-1 font-medium">创意故事生成</div>
        <div className="text-sm">
          使用我们的​​异构递归规划框架​​生成创意故事。只需提供一个描述故事内容的提示，系统将通过递归规划自动生成结构完整的叙事。
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
                      明确具体​​主题，详细说明你希望故事中包含的具体角色特征、场景细节和情节要素。
                    </div>
                    <div className="mb-1">
                      设定参数，请明确指定所需的故事视角（第一人称/第三人称）、叙事基调（幽默/严肃）及篇幅长度。
                    </div>
                    <div>
                      保留创作空间，在提供基本框架的同时，请允许系统发挥创造力，为故事注入更丰富的元素。
                    </div>
                  </div>
                }
              >
                高效故事创作提示词技巧
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
            {settings.providers.map((provider) => (
              <SelectSection showDivider title={provider.name}>
                {provider.models.map((model) =>
                  model.enabled ? (
                    <SelectItem key={model.value}>{model.name}</SelectItem>
                  ) : (
                    <></>
                  )
                )}
              </SelectSection>
            ))}
          </Select>

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
