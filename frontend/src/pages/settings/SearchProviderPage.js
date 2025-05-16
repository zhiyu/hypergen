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

import defaultSettings from "../../config/models";

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
      providers: prev.providers.map((p) =>
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
      providers: prev.providers.map((p) =>
        p.name === provider ? { ...p, apihost: value } : p
      ),
    }));
  }

  /**
   * 设置指定服务商下特定模型的启用状态
   * @param {string} provider - 服务商名称
   * @param {string} model - 模型标识符
   * @param {boolean} enabled - 是否启用该模型
   */
  function setModelEnabled(provider, model, enabled) {
    setSettings((prev) => ({
      ...prev,
      providers: prev.providers.map((p) => {
        return p.name === provider
          ? {
              ...p,
              models: p.models.map((_model) =>
                _model.name == model ? { ..._model, enabled: enabled } : _model
              ),
            }
          : p;
      }),
    }));
  }

  /**
   * 删除指定服务商的模型
   * @param {string} provider - 服务商名称
   * @param {string} modelName - 要删除的模型名称
   */
  function deleteModel(provider, modelName) {
    setSettings((prev) => ({
      ...prev,
      providers: prev.providers.map((p) => {
        return p.name === provider
          ? {
              ...p,
              models: p.models.filter((model) => model.name !== modelName),
            }
          : p;
      }),
    }));
  }

  /**
   * 添加指定服务商的模型
   * @param {string} provider - 服务商名称
   */

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newModel, setNewModel] = useState({
    name: "",
    value: "",
    enabled: true,
  });

  const handleAddModel = (provider) => {
    const _providers = settings.providers.map((p) => {
      if (p.name === provider) {
        p.models.push({ ...newModel });
      }
      return p;
    });
    setSettings((prev) => ({
      ...prev,
      providers: _providers,
    }));

    setNewModel({ name: "", value: "", enabled: true });
    onOpenChange(false);
  };

  const [newProvider, setNewProvider] = useState({
    name: "",
    apikey: "",
    apihost: "",
    models: [],
  });

  const handleAddProvider = () => {
    const _providers = [...settings.providers, { ...newProvider }];
    setSettings((prev) => ({
      ...prev,
      providers: _providers,
    }));
    setNewProvider({
      name: "",
      apikey: "",
      apihost: "",
      models: [],
    });
    onOpenChange(false);
  };

  const handleDeleteProvider = (providerName) => {
    const _providers = settings.providers.filter(
      (p) => p.name !== providerName
    );
    setSettings((prev) => ({
      ...prev,
      providers: _providers,
    }));
  };

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
          添加模型服务商
        </Button>
      </div>
      <div className="flex w-full flex-col mt-12 mb-8">
        <Tabs
          aria-label="Options"
          isVertical={true}
          variant="underlined"
          size="lg"
        >
          {settings.providers.map((provider) => (
            <Tab key={provider.name} title={provider.name} className="px-0">
              <Card className="ml-8">
                <CardHeader className="h-16 px-6 font-medium flex items-center justify-between">
                  <div className="flex items-center">
                    {provider.icon && (
                      <Image
                        src={provider.icon + "_" + theme + ".svg"}
                        className="mr-2 w-5 h-5"
                      />
                    )}
                    {!provider.icon && <PiBrain className="mr-2 w-5 h-5" />}
                    {provider.name}
                  </div>
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
                    <div>模型</div>
                    <Button
                      size="sm"
                      onPress={() => {
                        setModalType("model");
                        onOpen();
                      }}
                    >
                      添加模型
                    </Button>
                  </div>

                  {provider.models.map((model) => (
                    <div className="w-full flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-medium">
                          {model.name} （{model.value}）
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          isSelected={model.enabled}
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
                            setModelEnabled(
                              provider.name,
                              model.name,
                              isSelected
                            );
                          }}
                        ></Switch>
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => deleteModel(provider.name, model.name)}
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Modal
                    backdrop="blur"
                    isOpen={isOpen && modalType == "model"}
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
                            添加新模型
                          </ModalHeader>
                          <ModalBody>
                            <Input
                              label="模型名称"
                              placeholder="请输入模型名称"
                              value={newModel.name}
                              onChange={(e) =>
                                setNewModel({
                                  ...newModel,
                                  name: e.target.value,
                                })
                              }
                              variant="bordered"
                            />
                            <Input
                              className="mt-4"
                              label="模型标识符"
                              placeholder="请输入模型标识符"
                              value={newModel.value}
                              onChange={(e) =>
                                setNewModel({
                                  ...newModel,
                                  value: e.target.value,
                                })
                              }
                              variant="bordered"
                            />
                            <div className="flex items-center mt-4">
                              <Switch
                                size="sm"
                                isSelected={newModel.enabled}
                                onValueChange={(enabled) =>
                                  setNewModel({ ...newModel, enabled })
                                }
                              />
                              <span className="ml-2">启用模型</span>
                            </div>
                          </ModalBody>
                          <ModalFooter>
                            <Button variant="flat" onPress={onClose}>
                              取消
                            </Button>
                            <Button
                              color="primary"
                              onPress={() => handleAddModel(provider.name)}
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
