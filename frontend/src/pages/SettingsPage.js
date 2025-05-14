import React, { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";

import {
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardBody,
  Switch,
  Accordion,
  AccordionItem,
  Chip,
  Button,
  Input,
  Textarea,
  Tooltip,
  Select,
  SelectItem,
  Alert,
  cn,
} from "@heroui/react";

import {
  PiWarningCircle,
  PiKey,
  PiMagicWand,
  PiBrain,
  PiEye,
  PiEyeClosed,
} from "react-icons/pi";

import defaultProviders from "../config/models";

const SettingsPage = () => {
  const [providers, setProviders] = useState(
    JSON.parse(localStorage.getItem("providers")) || defaultProviders
  );

  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem("openai_api_key") || "",
    claude: localStorage.getItem("claude_api_key") || "",
    gemini: localStorage.getItem("gemini_api_key") || "",
    qwen: localStorage.getItem("qwen_api_key") || "",
  });

  const [showApiKeys, setShowApiKeys] = useState({});
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showClaudeKey, setShowClaudeKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showQwenKey, setShowQwenKey] = useState(false);

  useEffect(() => {
    if (apiKeys.openai) localStorage.setItem("openai_api_key", apiKeys.openai);
    if (apiKeys.claude) localStorage.setItem("claude_api_key", apiKeys.claude);
    if (apiKeys.gemini) localStorage.setItem("gemini_api_key", apiKeys.gemini);
    if (apiKeys.qwen) localStorage.setItem("qwen_api_key", apiKeys.qwen);
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem("providers", JSON.stringify(providers));
  }, [providers]);

  const handleShowApiKeysChange = (provider, value) => {
    setShowApiKeys((prev) => ({
      ...prev,
      [provider]: value,
    }));
  };

  function updateApiKey(provider, value) {
    const updates = providers.map((_provider) => {
      if (_provider.name == provider) {
        _provider.apikey = value;
      }
      return _provider;
    });
    setProviders(updates);
  }

  /**
   * 更新指定服务商的API Host地址
   * @param {string} name - 服务商名称
   * @param {string} value - 新的API Host地址
   */
  function updateApiHost(provider, value) {
    const updates = providers.map((_provider) => {
      if (_provider.name == provider) {
        _provider.apihost = value;
      }
      return _provider;
    });
    setProviders(updates);
  }

  /**
   * 设置指定服务商下特定模型的启用状态
   * @param {string} provider - 服务商名称
   * @param {string} model - 模型标识符
   * @param {boolean} enabled - 是否启用该模型
   */
  function setModelEnabled(provider, model, enabled) {
    const _providers = providers.map((_provider) => {
      if (_provider.name == provider) {
        const _models = _provider.models.map((_model) => {
          if (_model.name == model) {
            _model.enabled = enabled;
          }
          return _model;
        });
        _provider.models = _models;
      }
      return _provider;
    });
    setProviders(_providers);
  }

  const handleApiKeyChange = (provider, value) => {
    console.log(value);
    setApiKeys((prev) => ({
      ...prev,
      [provider]: value,
    }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <div className="text-2xl mb-1 font-medium">设置</div>
        <div className="text-sm">
          管理模型和服务商。您的模型配置和API密钥信息会安全存储在浏览器的本地存储中。
        </div>
      </Box>
      <div className="flex w-full flex-col mb-8">
        <Tabs
          aria-label="Options"
          isVertical={true}
          variant="underlined"
          size="lg"
        >
          {providers.map((provider) => (
            <Tab key={provider.name} title={provider.name} className="px-0">
              <Card className="ml-8">
                <CardHeader className="p-4 px-6">{provider.name}</CardHeader>
                <CardBody className="px-6">
                  <div
                    style={{
                      visibility: "hidden",
                      height: 1,
                      overflow: "hidden",
                    }}
                  >
                    placeholderpla ceholder placeholderp lace holder
                    placelaceholder laceholderlaceholder laceholder
                    laceholderlaceholder holderp laceholde rplaceholderpl
                    aclaceholder laceholderlaceholderlaceholder
                  </div>
                  <Input
                    className="w-full"
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-none"
                        type="button"
                        onClick={() =>
                          handleShowApiKeysChange(
                            provider.name,
                            !showApiKeys[provider.name]
                          )
                        }
                      >
                        {!showApiKeys[provider.name] ? (
                          <PiEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <PiEye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    onChange={(e) =>
                      updateApiKey(provider.name, e.target.value)
                    }
                    label={"API Key"}
                    placeholder={"请输入 API Key"}
                    type={showApiKeys[provider.name] ? "text" : "password"}
                    size="lg"
                    variant="underlined"
                    value={provider.apikey}
                    description=""
                  />
                  <Input
                    className="w-full mt-4"
                    onChange={(e) =>
                      updateApiHost(provider.name, e.target.value)
                    }
                    label={"API Host"}
                    placeholder={"请输入 API Host"}
                    type={"text"}
                    size="lg"
                    variant="underlined"
                    value={provider.apihost}
                    description=""
                  />

                  <div className="my-4 mt-8">模型</div>

                  {provider.models.map((model) => (
                    <div className="w-full flex justify-between mb-2">
                      <p className="text-medium">{model.name}</p>
                      <Switch
                        isSelected={model.enabled}
                        classNames={{
                          base: cn("data-[selected=true]:border-primary"),
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
                        onValueChange={(isSelected) => {
                          setModelEnabled(
                            provider.name,
                            model.name,
                            isSelected
                          );
                        }}
                      ></Switch>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Tab>
          ))}
        </Tabs>
      </div>

      {/* <div>
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
                        <PiEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <PiEye className="text-2xl text-default-400 pointer-events-none" />
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
                        <PiEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <PiEye className="text-2xl text-default-400 pointer-events-none" />
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
                        <PiEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <PiEye className="text-2xl text-default-400 pointer-events-none" />
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
                        <PiEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <PiEye className="text-2xl text-default-400 pointer-events-none" />
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
                        <PiEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <PiEye className="text-2xl text-default-400 pointer-events-none" />
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
                        <PiEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <PiEye className="text-2xl text-default-400 pointer-events-none" />
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
                        <PiEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <PiEye className="text-2xl text-default-400 pointer-events-none" />
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
                        <PiEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <PiEye className="text-2xl text-default-400 pointer-events-none" />
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
      </div> */}
    </Container>
  );
};

export default SettingsPage;
