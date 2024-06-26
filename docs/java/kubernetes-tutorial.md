# kubernetes 教程

## 一、kubernetes 概述
### 1、kubernetes 基本介绍
kubernetes，简称 K8s，是用 8 代替 8 个字符“ubernete”而成的缩写。是一个开源 的，用于管理云平台中多个主机上的容器化的应用，Kubernetes 的目标是让部署容器化的 应用简单并且高效（powerful）,Kubernetes 提供了应用部署，规划，更新，维护的一种 机制。

传统的应用部署方式是通过插件或脚本来安装应用。这样做的缺点是应用的运行、配 置、管理、所有生存周期将与当前操作系统绑定，这样做并不利于应用的升级更新/回滚等操作，当然也可以通过创建虚拟机的方式来实现某些功能，但是虚拟机非常重，并不利于可移植性。

新的方式是通过部署容器方式实现，每个容器之间互相隔离，每个容器有自己的文件系统 ，容器之间进程不会相互影响，能区分计算资源。相对于虚拟机，容器能快速部署，由于容器与底层设施、机器文件系统解耦的，所以它能在不同云、不同版本操作系统间进行迁移。

容器占用资源少、部署快，每个应用可以被打包成一个容器镜像，每个应用与容器间 成一对一关系也使容器有更大优势，使用容器可以在 build 或 release 的阶段，为应用创 建容器镜像，因为每个应用不需要与其余的应用堆栈组合，也不依赖于生产环境基础结构， 这使得从研发到测试、生产能提供一致环境。类似地，容器比虚拟机轻量、更“透明”， 这更便于监控和管理。 

Kubernetes 是 Google 开源的一个容器编排引擎，它支持自动化部署、大规模可伸缩、 应用容器化管理。在生产环境中部署一个应用程序时，通常要部署该应用的多个实例以便对应用请求进行负载均衡。

在 Kubernetes 中，我们可以创建多个容器，每个容器里面运行一个应用实例，然后通 过内置的负载均衡策略，实现对这一组应用实例的管理、发现、访问，而这些细节都不需 要运维人员去进行复杂的手工配置和处理。

### 2、kubernetes 功能和架构
#### 2.1 概述

Kubernetes 是一个轻便的和可扩展的开源平台，用于管理容器化应用和服务。通过
Kubernetes 能够进行应用的自动化部署和扩缩容。在 Kubernetes 中，会将组成应用的容
器组合成一个逻辑单元以更易管理和发现。Kubernetes 积累了作为 Google 生产环境运行
工作负载 15 年的经验，并吸收了来自于社区的最佳想法和实践。

#### 2.2 K8s 功能:
| 功能点        | 详细解释                                                                                            |
|------------|-------------------------------------------------------------------------------------------------|
| 自动装箱       | 基于容器对应用运行环境的资源配置要求自动部署应用容器                                                                      |
| 自我修复(自愈能力) | 当容器失败时，会对容器进行重启 <br/>当所部署的 Node 节点有问题时，会对容器进行重新部署和重新调度<br/>当容器未通过监控检查时，会关闭此容器直到容器正常运行时，才会对外提供服务 |
| 水平扩展       | 通过简单的命令、用户 UI 界面或基于 CPU 等资源使用情况，对应用容器进行规模扩大或规模剪裁                                                |
| 服务发现       | 用户不需使用额外的服务发现机制，就能够基于 Kubernetes 自身能力实现服务发现和负载均衡                                                |
| 滚动更新       | 可以根据应用的变化，对应用容器运行的应用，进行一次性或批量式更新                                                                |
| 版本回退       | 可以根据应用部署情况，对应用容器运行的应用，进行历史版本即时回退                                                                |
| 密钥和配置管理    | 在不需要重新构建镜像的情况下，可以部署和更新密钥和应用配置，类似热部署。                                                            |
| 存储编排       | 自动实现存储系统挂载及应用，特别对有状态应用实现数据持久化非常重要<br/>存储系统可以来自于本地目录、网络存储(`NFS、Gluster、Ceph 等`)、公共云存储服务          |
| 批处理        | 提供一次性任务，定时任务；满足批量数据处理和分析的场景                                                                     |

#### 2.3 应用部署架构分类
| (1) 无中心节点架构 | (2) 有中心节点架构 |
|-------------|-------------|
| GlusterFS   | HDFS、K8S    |

#### 2.4 k8s 集群架构
`![24k8sFrameWork](24k8sFrameWork.png)`

#### 2.5 k8s 集群架构节点角色功能

| Master Node                                                                                                                                | Worker Node                                                                  |
|--------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| k8s 集群控制节点，对集群进行调度管理，接受集群外用户去集群操作请求；<br/> Master Node 由 API Server、Scheduler、ClusterState Store（ETCD 数据库）和<br/>Controller MangerServer 所组成 | 集群工作节点，运行用户业务应用容器；<br/>Worker Node 包含 kubelet、kube proxy 和 ContainerRuntime； |


`![k8sRole](k8sRole.png)`

## 二、kubernetes 集群搭建(kubeadm 方式)
### 1、前置知识点
目前生产部署 Kubernetes 集群主要有两种方式：

- kubeadm

Kubeadm 是一个 K8s 部署工具，提供 kubeadm init 和 kubeadm join，用于快速部
署 Kubernetes 集群。

官方地址：https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm/

- 二进制包(不使用)

从 github 下载发行版的二进制包，手动部署每个组件，组成 Kubernetes 集群。

Kubeadm 降低部署门槛，但屏蔽了很多细节，遇到问题很难排查。如果想更容易可 控，推荐使用二进制包部署 Kubernetes 集群，虽然手动部署麻烦点，期间可以学习很多工作原理，也利于后期维护。

### 2、kubeadm 部署方式介绍

kubeadm 是官方社区推出的一个用于快速部署 kubernetes 集群的工具，这个工具能通 过两条指令完成一个 kubernetes 集群的部署：
- 第一、创建一个 Master 节点
```shell
kubeadm init
```

- 第二， 将 Node 节点加入到当前集群中
```shell
kubeadm join <Master 节点的 IP 和端口>
```

### 3、安装要求
在开始之前，部署 Kubernetes 集群机器需要满足以下几个条件：
- 一台或多台机器，操作系统 CentOS7.x-86_x64
- 硬件配置：2GB 或更多 RAM，2 个 CPU 或更多 CPU，硬盘 30GB 或更多
- 集群中所有机器之间网络互通
- 可以访问外网，需要拉取镜像
- 禁止 swap 分区

### 4、最终目标

1. 在所有节点上安装 Docker 和 kubeadm
2. 部署 Kubernetes Master
3. 部署容器网络插件
4. 部署 Kubernetes Node，将节点加入 Kubernetes 集群中
5. 部署 Dashboard Web 页面，可视化查看 Kubernetes 资源

### 5.准备环境
`![start](start.png)`

| 角色         | IP            |
|------------|---------------|
| k8s-master | 192.168.31.61 |
| k8s-node1  | 192.168.31.62 |
| k8s-node2  | 192.168.31.63 |

### 6、系统初始化

#### 6.1 关闭防火墙：
```shell
systemctl stop firewalld
systemctl disable firewalld
```
#### 6.2 关闭 selinux：
```shell
sed -i 's/enforcing/disabled/' /etc/selinux/config # 永久
setenforce 0 # 临时
```

#### 6.3 关闭 swap：
```shell
swapoff -a # 临时
vim /etc/fstab # 永久
```

#### 6.4 主机名：
```shell
hostnamectl set-hostname <hostname>
```

#### 6.5 在 master 添加 hosts：
```shell
cat >> /etc/hosts << EOF
192.168.31.61 k8s-master
192.168.31.62 k8s-node1
192.168.31.63 k8s-node2
EOF
```

#### 6.6 将桥接的 IPv4 流量传递到 iptables 的链：
```shell
cat > /etc/sysctl.d/k8s.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system # 生效
```

#### 6.7 时间同步：
```shell
yum install ntpdate -y
ntpdate time.windows.com
```

### 7、所有节点安装 Docker/kubeadm/kubelet
Kubernetes 默认 CRI（容器运行时）为 Docker，因此先安装 Docker。

1. 安装 Docker
    ```shell
    wget https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo -O /etc/yum.repos.d/docker-ce.repo
    yum -y install docker-ce-18.06.1.ce-3.el7
    systemctl enable docker && systemctl start docker
    docker --version
    ```

2. 添加阿里云 YUM 软件源
   ```shell
   # 设置docker仓库地址
   cat > /etc/docker/daemon.json << EOF
   {
   "registry-mirrors": ["https://b9pmyelo.mirror.aliyuncs.com"]
   }
   EOF 
   
   # 添加 yum 源
   cat > /etc/yum.repos.d/kubernetes.repo << EOF
   [kubernetes]
   name=Kubernetes
   baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
   enabled=1
   gpgcheck=0
   repo_gpgcheck=0
   gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
   https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
   EOF 
   ```

3. 安装 kubeadm，kubelet 和 kubectl
```shell
yum install -y kubelet kubeadm kubectl
systemctl enable kubelet
```

### 8、部署 Kubernetes Master

（1）在 192.168.31.61（Master）执行
```shell
# 由于默认拉取镜像地址 k8s.gcr.io 国内无法访问，这里指定阿里云镜像仓库地址。
kubeadm init \
--apiserver-advertise-address=192.168.31.61 \
--image-repository registry.aliyuncs.com/google_containers \
--kubernetes-version v1.17.0 \
--service-cidr=10.96.0.0/12 \
--pod-network-cidr=10.244.0.0/16
```

（2）使用 kubectl 工具：
```shell
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
kubectl get nodes
```

### 9、安装 Pod 网络插件（CNI）
```shell
# 确保能够访问到 quay.io 这个 registery。如果 Pod 镜像下载失败，可以改这个镜像地址
$ kubectl apply –f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

```

### 10、加入 Kubernetes Node
在 192.168.31.62/63（Node）执行,向集群添加新节点，执行在 kubeadm init 输出的 kubeadm join 命令：
```
kubeadm join 192.168.31.61:6443 --token esce21.q6hetwm8si29qxwn \
--discovery-token-ca-cert-hash \
sha256:00603a05805807501d7181c3d60b478788408cfe6cedefedb1f97569708be9c5
```

### 11、测试 kubernetes 集群
在 Kubernetes 集群中创建一个 pod，验证是否正常运行：
```shell
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=NodePort
kubectl get pod,svc
```

访问地址：http://NodeIP:Port
> 任意node IP 即可，node回自动分配高段位端口，并且转发到某一指定的80端口，重启不会失效。

## 三、kubernetes 集群搭建(二进制方式)

### 1、安装要求
在开始之前，部署 Kubernetes 集群机器需要满足以下几个条件：

1. 一台或多台机器，操作系统 CentOS7.x-86_x64
2. 硬件配置：2GB 或更多 RAM，2 个 CPU 或更多 CPU，硬盘 30GB 或更多
3. 集群中所有机器之间网络互通
4. 可以访问外网，需要拉取镜像，如果服务器不能上网，需要提前下载镜像并导入节点
5. 禁止 swap 分区
> 1. 内存限制管理：Kubernetes 可以为每个容器设置内存限制，以确保应用程序不会超出其可用的内存资源。但如果允许使用 swap 分区，那么当物理内存不足时，Linux 内核会将一部分内存交换到磁盘上的 swap 分区，这可能会导致容器的内存使用超出限制。
> 2. 性能稳定性：将内存交换到磁盘上的 swap 分区会导致大量的磁盘 IO 操作，这会降低系统的性能。尤其是在容器化环境中，应用程序的性能对于整个集群的稳定性和吞吐量至关重要。
> 3. 可预测性：在容器环境中，容器通常被设计为可以快速启动和停止，并且可以动态调整资源。使用 swap 分区可能会导致启动时间延长，因为需要将交换出的内存从磁盘读取回内存中。
> 4. 避免 OOM（Out of Memory）：如果 Kubernetes 允许使用 swap 分区，那么当容器试图使用已经交换出去的内存时，可能会触发 Linux 内核的 OOM 杀死机制，导致整个容器或节点不稳定甚至崩溃。

### 2、准备环境

1. 软件环境：

   | 软件         | 版本                   |
   |------------|----------------------|
   | 操作系统       | CentOS7.8_x64 （mini） |
   | Docker     | 19-ce                |
   | Kubernetes | 1.19                 |

2. 服务器规划：

| 角色         | IP            | 组件                                                         |
|------------|---------------|------------------------------------------------------------|
| k8s-master | 192.168.31.71 | kube-apiserver，kube-controller-manager，kube-scheduler，etcd |
| k8s-node1  | 192.168.31.72 | kubelet，kube-proxy，docker etcd                             |
| k8s-node2  | 192.168.31.73 | kubelet，kube-proxy，docker，etcd                             |

### 3、操作系统初始化配

```shell
# 关闭防火墙
systemctl stop firewalld
systemctl disable firewalld
# 关闭 selinux
sed -i 's/enforcing/disabled/' /etc/selinux/config
# 永久
setenforce 0
# 临时
# 关闭 swap
swapoff -a
# 临时
sed -ri 's/.*swap.*/#&/' /etc/fstab
# 永久
# 根据规划设置主机名
hostnamectl set-hostname <hostname>
# 在 master 添加 hosts
cat >> /etc/hosts << EOF
192.168.44.147 m1
192.168.44.148 n1
EOF
# 将桥接的 IPv4 流量传递到 iptables 的链
cat > /etc/sysctl.d/k8s.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system
# 生效
# 时间同步
yum install ntpdate -y
ntpdate time.windows.com
```

### 4、部署 Etcd 集群
### 5、安装 Docker
### 6、部署 Master Node
### 7、部署 Worker Node

## 四、kubernetes 集群 YAML 文件详解

### 1、YAML 文件概述
k8s 集群中对资源管理和资源对象编排部署都可以通过声明样式（YAML）文件来解决，
也就是可以把需要对资源对象操作编辑到 YAML 格式文件中，我们把这种文件叫做资源清单文件，
通过 kubectl 命令直接使用资源清单文件就可以实现对大量的资源对象进行编排部署了。

### 2、YAML 文件书写格式
1. YAML 支持的数据结构
- 对象：键值对的集合，又称为映射（mapping）/ 哈希（hashes） / 字典（dictionary）
- 数组：一组按次序排列的值，又称为序列（sequence） / 列表（list）
- 纯量（scalars）：单个的、不可再分的值
- 复合结构：由数组和对象组成的复合结构

略

### 3、资源清单描述方法

1. 在 k8s 中，一般使用 YAML 格式的文件来创建符合我们预期期望的 pod,这样的 YAML 文件称为资源清单。

2. 常用字段

   - 必须存在的属性

   | 参数名                    | 字段类型   | 说明                                            |
   |------------------------|--------|-----------------------------------------------|
   | version                | String | K8SAPI的版本，目前基本是v1，可以用`kubectlapi-version`命令查询 |
   | kind                   | String | 这里指的是yaml文件定义的资源类型和角色，比如：Pod                  |
   | metadata               | Object | 元数据对象，固定值写metadata                            |
   | metadata.name          | String | 元数据对象的名字，这里由我们编写，比如命名Pod的名字                   |
   | metadata.namespace     | String | 元数据对象的命名空间，由我们自身定义                            |
   | Spec                   | Object | 详细定义对象，固定值写Spec                               |
   | spec.container[]       | list   | 这里是Spec对象的容器列表定义，是个列表                         |
   | spec.container[].name  | String | 这里定义容器的名字                                     |
   | spec.container[].image | String | 这里定义要用到的镜像名称                                  |

   - spec 主要对象

   | 参数名                               | 字段类型   | 说明                                                                                                                                                              |
   |-----------------------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | spec.containers[].name            | string | 定义容器的名字                                                                                                                                                         |
   | spec.containers[].image           | String | 定义要用到的镜像的名称                                                                                                                                                     |
   | spec.containers[].imagePullPolicy | String | 定义镜像拉取策略，有Always，Never，IfNotPresent三个值课选<br/>（1）Always：意思是每次尝试重新拉取镜像<br/>（2）Never：表示仅使用本地镜像<br/>（3）IfNotPresent：如果本地有镜像就是用本地镜像，没有就拉取在线镜像。上面三个值都没设置的话，默认是Always. |
   |                                   |        |                                                                                                                                                                 |
   | spec.containers[].command[]       | List   | 指定容器启动命令，因为是数组可以指定多个，不指定则使用镜像打包时使用的启动命令。                                                                                                                        |
   | spec.containers[]args[]           | List   | 指定容器启动命令参数，因为是数组可以指定多个。                                                                                                                                         |
   | spec.containers[].workingDir      | String | 指定容器的工作目录                                                                                                                                                       |
   | spec.containers[].volumeMounts[]  | List   | 指定容器内部的存储卷配置                                                                                                                                                    |
   | ......                            | ...... | ......                                                                                                                                                          |

3. 举例说明
- 创建一个namespace
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: test
```
- 创建一个Pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod1
spec:
  containers:
  - name: nginx-containers
    image: nginx:1.14.2
```

## 五、kubernetes 集群命令行工具 kubectl

### 1、kubectl 概述

kubectl 是 Kubernetes 集群的命令行工具，通过 kubectl 能够对集群本身进行管理， 并能够在集群上进行容器化应用的安装部署。

### 2、kubectl 命令的语法
```shell
kubectl [command] [TYPE] [NAME] [flags]
```
- comand：指定要对资源执行的操作，例如 create、get、describe 和 delete
- TYPE：指定资源类型，资源类型是大小写敏感的，开发者能够以单数、复数和缩略的 形式。例如：
   ```shell
   kubectl get pod pod1
   kubectl get poods pod1
   kubectl get po pod1
   ```
- NAME：指定资源的名称，名称也大小写敏感的。如果省略名称，则会显示所有的资源，例如:
```shell
kubectl get pods
```
- flags：指定可选的参数。例如，可用-s 或者–server 参数指定 Kubernetes API
server 的地址和端口。

### 3、kubectl help 获取更多信息

获取kubectl帮助方法
[root@masterl ~]# kubectl --help


### 4、kubectl 子命令使用分类

1. 基础命令

   |      |         |                             |
   |------|---------|-----------------------------|
   | 基础命令 | create  | 通过文件名或标准输入创建资源              |
   |      | expose  | 将一个资源公开为一个新的 Service        |
   |      | run     | 在集群中运行一个特定的镜像基础命令           |
   |      | set     | 在对象上设置特定的功能                 |
   |      | got     | 显示一个或多个资源                   |
   |      | explain | 文档参考资料                      |
   |      | edit    | 使用默认的编辑器编辑一个资源。             |
   |      | delete  | 通过文件名、标准输入、资源名称或标签选择器来删除资源。 |

2. 部署和集群管理命令

   |      |                |                                               |
   |------|----------------|-----------------------------------------------|
   | 部署命令 | rollout        | 管理资源的发布                                       |
   |      | rolling-update | 对给定的复制控制器滚动更新                                 |
   |      | scale          | 扩容或缩容Pod数量，Deployment、ReplicaSet、RC或Job       |
   |      | autoscale      | 创建一个自动选择扩容或缩容并设置Pod数量                         |
   |      | cerlificate    | 修改证书资源                                        |
   |      | cluster-info   | 显示集群信息                                        |
   |      | top            | 显示资源（CPU/Memory/Storage）使用。需要Heapster运行集群管理命令 |
   |      | cordon         | 标记节点不可调度                                      |
   |      | uncordon       | 标记节点可调度                                       |
   |      | drain          | 驱逐节点上的应用，准备下线维护                               |
   |      | taint          | 修改节点taint标记                                   |

3. 故障和调试命令
4. 其他命令

## 六、kubernetes 核心技术-Pod

### 1、Pod 概述

Pod 是 k8s 系统中可以创建和管理的最小单元，是资源对象模型中由用户创建或部署的最 小资源对象模型， 也是在 k8s 上运行容器化应用的资源对象，其他的资源对象都是用来支撑或者扩展 Pod 对象功能的，比如控制器对象是用来管控 Pod 对象的，Service 或者Ingress 资源对象是用来暴露 Pod 引用对象的，PersistentVolume 资源对象是用来为 Pod提供存储等等，k8s 不会直接处理容器，而是 Pod，Pod 是由一个或多个 container 组成Pod 是 Kubernetes 的最重要概念，每一个 Pod 都有一个特殊的被称为”根容器“的 Pause容器。Pause 容器对应的镜 像属于 Kubernetes 平台的一部分，除了 Pause 容器，每个 Pod还包含一个或多个紧密相关的用户业务容器。

Pod: `Pause`, `user container1`, `user container2`

1. Pod vs 应用.每个 Pod 都是应用的一个实例，有专用的 IP
2. Pod vs 容器.一个 Pod 可以有多个容器，彼此间共享网络和存储资源，每个 Pod 中有一个 Pause 容器保存所有的容器状态， 通过管理 pause 容器，达到管理 pod 中所有容器的效果
3. Pod vs 节点.同一个 Pod 中的容器总会被调度到相同 Node 节点，不同节点间 Pod 的通信基于虚拟二层网络技术实现
4. Pod vs Pod.普通的 Pod 和静态Pod

### 2、Pod 特性
1. 资源共享

   一个 Pod 里的多个容器可以共享存储和网络，可以看作一个逻辑的主机。共享的如 namespace,cgroups 或者其他的隔离资源。 

   多个容器共享同一 network namespace，由此在一个 Pod 里的多个容器共享 Pod 的 IP 和 端口 namespace，所以一个 Pod 内的多个容器之间可以通过 localhost 来进行通信,所需要注意的是不同容器要注意不要有端口冲突即可。不同的 Pod 有不同的 IP,不同 Pod 内的多个容器之前通信，不可以使用 IPC（如果没有特殊指定的话）通信，通常情况下使用 Pod 的 IP 进行通信。
   
   一个 Pod 里的多个容器可以共享存储卷，这个存储卷会被定义为 Pod 的一部分，并且可
   以挂载到该 Pod 里的所有容器的文件系统上。

2. 生命周期短暂

   Pod 属于生命周期比较短暂的组件，比如，当 Pod 所在节点发生故障，那么该节点上的 Pod 会被调度到其他节点，但需要注意的是，被重新调度的 Pod 是一个全新的 Pod,跟之前的 Pod 没有半毛钱关系


