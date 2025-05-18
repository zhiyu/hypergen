import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import { useTheme } from "next-themes";

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
  Image,
  cn,
} from "@heroui/react";

import {
  PiWarningCircle,
  PiKey,
  PiMagicWand,
  PiBrain,
  PiEye,
  PiEyeClosed,
  PiTrash,
} from "react-icons/pi";

import defaultSettings from "../../config/settings";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

const SearchProviderPage = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem("settings")) || defaultSettings
  );

  const [showApiKeys, setShowApiKeys] = useState({});

  const [modalType, setModalType] = useState("");

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const handleShowApiKeysChange = (provider, value) => {
    setShowApiKeys((prev) => ({
      ...prev,
      [provider]: value,
    }));
  };

  function updateApiKey(provider, value) {
    setSettings((prev) => ({
      ...prev,
      searchProviders: prev.searchProviders.map((p) =>
        p.name === provider ? { ...p, apikey: value } : p
      ),
    }));
  }

  /**
   * 更新指定服务商的API Host地址
   * @param {string} name - 服务商名称
   * @param {string} value - 新的API Host地址
   */
  function updateApiHost(provider, value) {
    setSettings((prev) => ({
      ...prev,
      searchProviders: prev.searchProviders.map((p) =>
        p.name === provider ? { ...p, apihost: value } : p
      ),
    }));
  }

  /**
   * 设置指定服务商下特定引擎的启用状态
   * @param {string} provider - 服务商名称
   * @param {string} engine - 引擎标识符
   * @param {boolean} enabled - 是否启用该引擎
   */
  function setEngineEnabled(provider, engine, enabled) {
    setSettings((prev) => ({
      ...prev,
      searchProviders: prev.searchProviders.map((p) => {
        return p.name === provider
          ? {
              ...p,
              engines: p.engines.map((_engine) =>
                _engine.name == engine
                  ? { ..._engine, enabled: enabled }
                  : _engine
              ),
            }
          : p;
      }),
    }));
  }

  /**
   * 删除指定服务商的引擎
   * @param {string} provider - 服务商名称
   * @param {string} engineName - 要删除的引擎名称
   */
  function deleteEngine(provider, engineName) {
    setSettings((prev) => ({
      ...prev,
      searchProviders: prev.searchProviders.map((p) => {
        return p.name === provider
          ? {
              ...p,
              engines: p.engines.filter((engine) => engine.name !== engineName),
            }
          : p;
      }),
    }));
  }

  /**
   * 添加指定服务商的引擎
   * @param {string} provider - 服务商名称
   */

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newEngine, setNewEngine] = useState({
    name: "",
    value: "",
    enabled: true,
  });

  const handleAddEngine = (provider) => {
    const _providers = settings.searchProviders.map((p) => {
      if (p.name === provider) {
        p.engines.push({ ...newEngine });
      }
      return p;
    });
    setSettings((prev) => ({
      ...prev,
      searchProviders: _providers,
    }));

    setNewEngine({ name: "", value: "", enabled: true });
    onOpenChange(false);
  };

  const [newProvider, setNewProvider] = useState({
    name: "",
    apikey: "",
    apihost: "",
    engines: [],
  });

  const handleAddProvider = () => {
    const _providers = [...settings.searchProviders, { ...newProvider }];
    setSettings((prev) => ({
      ...prev,
      searchProviders: _providers,
    }));
    setNewProvider({
      name: "",
      apikey: "",
      apihost: "",
      engines: [],
    });
    onOpenChange(false);
  };

  const handleDeleteProvider = (providerName) => {
    const _providers = settings.searchProviders.filter(
      (p) => p.name !== providerName
    );
    setSettings((prev) => ({
      ...prev,
      searchProviders: _providers,
    }));
  };

  console.log(settings.searchProviders);

  return (
    <Container maxWidth="lg">
      <div className="mt-12 flex justify-between items-center">
        <div>
          <div className="text-2xl mb-1 font-medium">搜索服务管理</div>
          <div className="text-sm flex justify-between items-center">
            管理搜索服务商。您的配置信息会安全存储在浏览器的本地存储中。
          </div>
        </div>
        <Button
          color="primary"
          onPress={() => {
            setModalType("provider");
            onOpen();
          }}
        >
          添加搜索服务商
        </Button>
      </div>
      <div className="flex w-full flex-col mt-12 mb-8">
        <Tabs
          aria-label="Options"
          isVertical={true}
          variant="underlined"
          size="lg"
        >
          {settings.searchProviders.map((provider) => (
            <Tab key={provider.name} title={provider.name} className="px-0">
              <Card className="ml-8">
                <CardHeader className="h-16 px-6 font-medium flex items-center justify-between">
                  <div className="flex items-center">{provider.name}</div>
                  {!provider.reserved && (
                    <Button
                      variant="light"
                      onPress={() => handleDeleteProvider(provider.name)}
                      startContent={<PiTrash size={16} />}
                    >
                      删除
                    </Button>
                  )}
                </CardHeader>
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
                    classNames={{
                      label: "font-medium text-lg",
                    }}
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
                  {provider.apihost && (
                    <Input
                      classNames={{
                        label: "font-medium text-lg text-black",
                      }}
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
                  )}
                  <div className="my-4 mt-8 flex justify-between items-center">
                    <div>引擎</div>
                    <Button
                      size="sm"
                      onPress={() => {
                        setModalType("engine");
                        onOpen();
                      }}
                    >
                      添加引擎
                    </Button>
                  </div>

                  {provider.engines.map((engine) => (
                    <div className="w-full flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-medium">
                          {engine.name} （{engine.value}）
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          isSelected={engine.enabled}
                          color="warning"
                          classNames={{
                            base: cn("data-[selected=true]:border-amber-500 "),
                            wrapper: "p-0 h-4 overflow-visible",
                            thumb: cn(
                              "w-6 h-6 border-2 shadow-lg ",
                              "group-data-[hover=true]:border-amber-500 ",
                              //selected
                              "group-data-[selected=true]:ms-6",
                              // pressed
                              "group-data-[pressed=true]:w-7",
                              "group-data-[selected]:group-data-[pressed]:ms-4"
                            ),
                          }}
                          onValueChange={(isSelected) => {
                            setEngineEnabled(
                              provider.name,
                              engine.name,
                              isSelected
                            );
                          }}
                        ></Switch>
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() =>
                            deleteEngine(provider.name, engine.name)
                          }
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Modal
                    backdrop="blur"
                    isOpen={isOpen && modalType == "engine"}
                    placement="center"
                    onOpenChange={onOpenChange}
                    motionProps={{
                      variants: {
                        enter: {
                          y: 0,
                          opacity: 1,
                          transition: {
                            duration: 0.3,
                            ease: "easeOut",
                          },
                        },
                        exit: {
                          y: -20,
                          opacity: 0,
                          transition: {
                            duration: 0.2,
                            ease: "easeIn",
                          },
                        },
                      },
                    }}
                  >
                    <ModalContent>
                      {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1">
                            添加新引擎
                          </ModalHeader>
                          <ModalBody>
                            <Input
                              label="引擎名称"
                              placeholder="请输入引擎名称"
                              value={newEngine.name}
                              onChange={(e) =>
                                setNewEngine({
                                  ...newEngine,
                                  name: e.target.value,
                                })
                              }
                              variant="bordered"
                            />
                            <Input
                              className="mt-4"
                              label="引擎标识符"
                              placeholder="请输入引擎标识符"
                              value={newEngine.value}
                              onChange={(e) =>
                                setNewEngine({
                                  ...newEngine,
                                  value: e.target.value,
                                })
                              }
                              variant="bordered"
                            />
                            <div className="flex items-center mt-4">
                              <Switch
                                size="sm"
                                isSelected={newEngine.enabled}
                                onValueChange={(enabled) =>
                                  setNewEngine({ ...newEngine, enabled })
                                }
                              />
                              <span className="ml-2">启用引擎</span>
                            </div>
                          </ModalBody>
                          <ModalFooter>
                            <Button variant="flat" onPress={onClose}>
                              取消
                            </Button>
                            <Button
                              color="primary"
                              onPress={() => handleAddEngine(provider.name)}
                            >
                              添加
                            </Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </CardBody>
              </Card>
            </Tab>
          ))}
        </Tabs>
      </div>
      <Modal
        backdrop="blur"
        isOpen={isOpen && modalType == "provider"}
        placement="top-center"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                添加新服务商
              </ModalHeader>
              <ModalBody>
                <Input
                  label="服务商名称"
                  placeholder="请输入服务商名称"
                  value={newProvider.name}
                  onChange={(e) =>
                    setNewProvider({ ...newProvider, name: e.target.value })
                  }
                  variant="bordered"
                />
                <Input
                  className="mt-4"
                  label="API Key"
                  placeholder="请输入 API Key"
                  value={newProvider.apikey}
                  onChange={(e) =>
                    setNewProvider({ ...newProvider, apikey: e.target.value })
                  }
                  variant="bordered"
                />
                <Input
                  className="mt-4"
                  label="API Host"
                  placeholder="请输入 API Host"
                  value={newProvider.apihost}
                  onChange={(e) =>
                    setNewProvider({ ...newProvider, apihost: e.target.value })
                  }
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={handleAddProvider}>
                  添加
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default SearchProviderPage;
