import React from "react";
import {
  Tabs,
  Tab,
  Chip,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Link,
} from "@heroui/react";

import {
  PiImage,
  PiMusicNotes,
  PiVideoCamera,
  PiArrowRight,
  PiMagnifyingGlass,
  PiBrain,
  PiPencilSimpleLine,
  PiGithubLogo,
} from "react-icons/pi";

const HomePage = () => {
  return (
    <div className="container mx-auto max-w-6xl flex flex-1 flex-col items-center justify-center">
      <div className="mt-16 z-20 flex flex-col items-center justify-center gap-[18px] sm:gap-6">
        <Link href="https://github.com/zhiyu/hypergen" color="foreground">
          <Button
            className="h-9 overflow-hidden border-1 border-default-100 bg-default-50 px-[18px] py-2 text-small font-normal leading-5"
            endContent={<PiArrowRight />}
            radius="full"
            variant="bordered"
          >
            更先进的 AI 写作框架
          </Button>
        </Link>
        <div className="text-center text-[clamp(40px,10vw,44px)] font-medium leading-[1.2] tracking-tighter sm:text-[64px]">
          <span
            style={{
              letterSpacing: "-0.025em",
              backgroundImage: "linear-gradient(to right, #db2777, #fcd34d)",
              backgroundClip: "text",
              color: "transparent",
              display: "inline-block",
            }}
          >
            支持拟人化长文本生成的 AI 写作助手
          </span>
        </div>
        <p className="text-center font-normal leading-7 sm:w-[466px] sm:text-[18px]">
          一个基于通用规划的文本写作框架，通过递归式任务分解与异构任务/工具的动态集成，实现自适应内容生成。
        </p>
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link href="https://github.com/zhiyu/hypergen" color="text-white">
            <Button
              className="w-full bg-gradient-to-tr from-pink-600 to-amber-300 text-white shadow-lg hover:scale-105"
              radius="full"
              size="lg"
            >
              立即体验
            </Button>
          </Link>

          <Link
            className="w-full"
            href="https://github.com/zhiyu/hypergen"
            color="foreground"
          >
            <Button
              className="w-full"
              radius="full"
              size="lg"
              variant="bordered"
            >
              了解更多
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-36">
        <div>
          <div className="text-4xl mb-2 font-medium text-center">
            它是如何工作的
          </div>
          <div className="text-center mb-12">
            异构递归规划通过自适应任务分解模拟人类认知过程，突破了传统写作方法的局限。
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="border border-gray-light shadow-lg shadow-gray-light p-2 hover:shadow-gray-dark hover:scale-105 hover:-translate-y-2">
            <CardHeader className="justify-between">
              <div className="flex items-center">
                <PiMagnifyingGlass size={24} color="#db2777" className="mr-2" />
                <div className="text-xl">检索</div>
              </div>
            </CardHeader>
            <CardBody className="text-default-600">
              采用动态信息检索机制，在文本生成过程中实时获取相关信息，确保事实准确性与主题覆盖完整性。
            </CardBody>
          </Card>
          <Card className="border border-gray-light shadow-lg shadow-gray-light p-2 hover:shadow-gray-dark hover:scale-105 hover:-translate-y-2">
            <CardHeader className="justify-between">
              <div className="flex items-center">
                <PiBrain size={24} color="#db2777" className="mr-2" />
                <div className="text-xl">推理</div>
              </div>
            </CardHeader>
            <CardBody className="text-default-600">
              采用逻辑分析方法进行内容结构的规划、组织与优化，确保生成文本具有严密的逻辑连贯性与良好的结构完整性。
            </CardBody>
          </Card>
          <Card className="border border-gray-light shadow-lg shadow-gray-light p-2 hover:shadow-gray-dark hover:scale-105 hover:-translate-y-2">
            <CardHeader className="justify-between">
              <div className="flex items-center">
                <PiPencilSimpleLine
                  size={24}
                  color="#db2777"
                  className="mr-2"
                />
                <div className="text-xl">创作</div>
              </div>
            </CardHeader>
            <CardBody className="text-default-600">
              基于信息检索与推理机制生成的内容，产出表达准确、富有吸引力的文本，同时确保上下文适应性与文体特征的一致性。
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mt-36">
        <div>
          <div className="text-4xl mb-2 font-medium text-center">适用场景</div>
          <div className="text-center mb-12">
            选择拟生成的内容类型，即刻体验异构递归规划技术的优势。
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="border border-gray-light shadow-lg shadow-gray-light p-2 hover:shadow-gray-dark hover:scale-105">
            <CardHeader className="block">
              <div className="text-2xl font-medium mb-2">故事生成</div>
              <div className="text-sm">轻松创作精彩故事</div>
            </CardHeader>
            <CardBody className="text-default-600">
              运用我们的异构递归规划方法，生成富有创意的叙事、小说和故事内容。特别适用于创意写作、娱乐产业及教育领域的内容创作。
              <div className="flex gap-2 mt-8">
                <Chip
                  classNames={{
                    base: "bg-gradient-to-tr from-pink-600 to-amber-300 border-small border-white/10",
                    content: "text-white",
                  }}
                  color="warning"
                  variant="flat"
                >
                  Fiction
                </Chip>
                <Chip
                  classNames={{
                    base: "bg-gradient-to-tr from-pink-600 to-amber-300 border-small border-white/10",
                    content: "text-white",
                  }}
                  color="warning"
                  variant="flat"
                >
                  Short Stories
                </Chip>
                <Chip
                  classNames={{
                    base: "bg-gradient-to-tr from-pink-600 to-amber-300 border-small border-white/10",
                    content: "text-white",
                  }}
                  color="warning"
                  variant="flat"
                >
                  Creative Writing
                </Chip>
              </div>
            </CardBody>
          </Card>
          <Card className="border border-gray-light shadow-lg shadow-gray-light p-2 hover:shadow-gray-dark hover:scale-105">
            <CardHeader className="block">
              <div className="text-2xl font-medium mb-2">报告生成</div>
              <div className="text-sm">撰写全面且具备事实依据的文档</div>
            </CardHeader>
            <CardBody className="text-default-600">
              通过精准信息检索与逻辑推理，创建内容全面的技术报告与文档系统，特别适用于新闻、技术和商业文档领域。
              <div className="flex gap-2 mt-8">
                <Chip
                  classNames={{
                    base: "bg-gradient-to-tr from-pink-600 to-amber-300 border-small border-white/10",
                    content: "text-white",
                  }}
                  color="warning"
                  variant="flat"
                >
                  Research
                </Chip>
                <Chip
                  classNames={{
                    base: "bg-gradient-to-tr from-pink-600 to-amber-300 border-small border-white/10",
                    content: "text-white",
                  }}
                  color="warning"
                  variant="flat"
                >
                  Analysis
                </Chip>
                <Chip
                  classNames={{
                    base: "bg-gradient-to-tr from-pink-600 to-amber-300 border-small border-white/10",
                    content: "text-white",
                  }}
                  color="warning"
                  variant="flat"
                >
                  Documentation
                </Chip>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="mt-36 w-full">
        <div className="text-4xl mb-2 font-medium text-center">
          写作思路，一目了然
        </div>
        <div className="text-center mb-12">
          该框架将复杂写作分解为可管理的子任务（包含检索、推理和写作），让整个创作过程清晰可见。
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex gap-4 items-center md:justify-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#fcd34d",
              }}
            >
              1
            </div>
            <span className="text-lg">写作任务的初始化拆解</span>
          </div>
          <div className="flex gap-4 items-center md:justify-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#fcd34d",
              }}
            >
              2
            </div>
            <span className="text-lg">子任务的递归规划</span>
          </div>
          <div className="flex gap-4 items-center md:justify-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#fcd34d",
              }}
            >
              3
            </div>
            <span className="text-lg">组件的动态集成</span>
          </div>
          <div className="flex gap-4 items-center md:justify-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#fcd34d",
              }}
            >
              4
            </div>
            <span className="text-lg">高质量内容生成</span>
          </div>
        </div>
      </div>

      <div className="mt-36 mb-24">
        <div className="text-4xl mb-2 font-medium">
          准备好革新您的写作流程了吗？
        </div>
        <div className="text-center">
          快来体验基于异构递归规划的新一代AI写作助手
        </div>
      </div>
    </div>
  );
};

export default HomePage;
