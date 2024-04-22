# 尚硅谷高级技术之JUC高并发编程 

## 1 什么是JUC 

### 1.1 JUC简介 

在 Java 中，线程部分是一个重点，本篇文章说的 JUC 也是关于线程的。JUC就是 java.util .concurrent 工具包的简称。这是一个处理线程的工具包，JDK 1.5 开始出现的。

`![image-20240421141352837](尚硅谷高级技术之JUC高并发编程.assets/image-20240421141352837-1713680050516-1.png)`

### 1.2 进程与线程 

**进程（Process）** 是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是操作系统结构的基础。 在当代面向线程设计的计算机结构中，进程是线程的容器。程序是指令、数据及其组织形式的描述，进程是程序的实例。是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是操作系统结构的基础。程序是指令、数据及其组织形式的描述，进程是程序的实例。

`![image-20240421141516654](尚硅谷高级技术之JUC高并发编程.assets/image-20240421141516654.png)`

**线程（thread）** 是操作系统能够进行运算调度的最小单位。它被包含在进程之中，是进程中的实际运作单位。一条线程指的是进程中一个单一顺序的控制流，一个进程中可以并发多个线程，每条线程并行执行不同的任务。

`![image-20240421142310057](尚硅谷高级技术之JUC高并发编程.assets/image-20240421142310057.png)`

**总结来说:**

进程：指在系统中正在运行的一个应用程序；程序一旦运行就是进程；进程— —资源分配的最小单位。

线程：系统分配处理器时间资源的基本单元，或者说进程之内独立执行的一个单元执行流。线程——程序执行的最小单位。

### 1.3 线程的状态 

#### 1.3.1 线程状态枚举类 

##### Thread.State 

```java
public enum State { 
    /** 
*	Thread state for a thread which has not yet started. 
     */ 
    NEW,(新建) 
    /** 
*	Thread state for a runnable thread.  A thread in the runnable 
*	state is executing in the Java virtual machine but it may      * be waiting for other resources from the operating system      * such as processor. 
     */ 
    RUNNABLE,（准备就绪） 
 
    /** 
*	Thread state for a thread blocked waiting for a monitor lock. 
*	A thread in the blocked state is waiting for a monitor lock 
*	to enter a synchronized block/method or 
*	reenter a synchronized block/method after calling      * {@link Object#wait() Object.wait}. 
     */ 
    BLOCKED,（阻塞） 
 
    /** 
*	Thread state for a waiting thread. 
*	A thread is in the waiting state due to calling one of the      * following methods: 
*	<ul> 
*	<li>{@link Object#wait() Object.wait} with no timeout</li> 
*	<li>{@link #join() Thread.join} with no timeout</li> 
*	<li>{@link LockSupport#park() LockSupport.park}</li>      * </ul> 
     * 
*	<p>A thread in the waiting state is waiting for another thread to      * perform a particular action. 
     * 
*	For example, a thread that has called <tt>Object.wait()</tt> 
*	on an object is waiting for another thread to call 
*	<tt>Object.notify()</tt> or <tt>Object.notifyAll()</tt> on      * that object. A thread that has called <tt>Thread.join()</tt>      * is waiting for a specified thread to terminate. 
     */ 
    WAITING,（不见不散） 
 
    /** 
*	Thread state for a waiting thread with a specified waiting time. 
*	A thread is in the timed waiting state due to calling one of 
*	the following methods with a specified positive waiting time: 
*	<ul> 
*	<li>{@link #sleep Thread.sleep}</li> 
*	<li>{@link Object#wait(long) Object.wait} with timeout</li> 
*	<li>{@link #join(long) Thread.join} with timeout</li> 
*	<li>{@link LockSupport#parkNanos LockSupport.parkNanos}</li> 
*	<li>{@link LockSupport#parkUntil LockSupport.parkUntil}</li> 
*	</ul> 
     */ 
    TIMED_WAITING,（过时不候） 
 
    /** 
*	Thread state for a terminated thread. 
*	The thread has completed execution. 
     */ 
    TERMINATED;(终结) 
} 

```

#### 1.3.2 wait/sleep的区别 

1.  sleep 是 Thread 的静态方法，wait 是 Object 的方法，任何对象实例都能调用。

2.  sleep 不会释放锁，它也不需要占用锁。wait 会释放锁，但调用它的前提是当前线程占有锁(即代码要在 synchronized 中)。

3.  它们都可以被 interrupted 方法中断。

### 1.4 并发与并行 

#### 1.4.1 串行模式 

串行表示所有任务都一一按先后顺序进行。串行意味着必须先装完一车柴才能运送这车柴，只有运送到了，才能卸下这车柴，并且只有完成了这整个三个步骤，才能进行下一个步骤。**串行是一次只能取得一个任务，并执行这个任务**。

#### 1.4.2 并行模式 

并行意味着可以同时取得多个任务，并同时去执行所取得的这些任务。并行模式相当于将长长的一条队列，划分成了多条短队列，所以并行缩短了任务队列的长度。并行的效率从代码层次上强依赖于多进程/多线程代码，从硬件角度上则依赖于多核 CPU。

#### 1.4.3 并发 

**并发(concurrent)指的是多个程序可以同时运行的现象，更细化的是多进程可以同时运行或者多指令可以同时运行**。但这不是重点，在描述并发的时候也不会去扣这种字眼是否精确，==并发的重点在于它是一种现象==, ==并发描述的是多进程同时运行的现象==。但实际上，对于单核心 CPU 来说，同一时刻只能运行一个线程。所以，这里的"同时运行"表示的不是真的同一时刻有多个线程运行的现象，这是并行的概念，而是提供一种功能让用户看来多个程序同时运行起来了，但实际上这些程序中的进程不是一直霸占 CPU 的，而是执行一会停一会。


**要解决大并发问题，通常是将大任务分解成多个小任务**, 由于操作系统对进程的调度是随机的，所以切分成多个小任务后，可能会从任一小任务处执行。这可能会出现一些现象：

- 可能出现一个小任务执行了多次，还没开始下个任务的情况。这时一般会采用队列或类似的数据结构来存放各个小任务的成果

- 可能出现还没准备好第一步就执行第二步的可能。这时，一般采用多路复用或异步的方式，比如只有准备好产生了事件通知才执行某个任务。

- 可以多进程/多线程的方式并行执行这些小任务。也可以单进程/单线程执行这些小任务，这时很可能要配合多路复用才能达到较高的效率

#### 1.4.4 小结(重点) 

**并发：**同一时刻多个线程在访问同一个资源，多个线程对一个点 例子：春运抢票 电商秒杀...

**并行：**多项工作一起执行，之后再汇总 例子：泡方便面，电水壶烧水，一边撕调料倒入桶中

### 1.5管程 

管程(monitor)是保证了同一时刻只有一个进程在管程内活动,即管程内定义的操作在同一时刻只被一个进程调用(由编译器实现).但是这样并不能保证进程以设计的顺序执行

JVM中同步是基于进入和退出管程(monitor)对象实现的，每个对象都会有一个管程

(monitor)对象，管程(monitor)会随着 java对象一同创建和销毁

执行线程首先要持有管程对象，然后才能执行方法，当方法完成之后会释放管程，方法在执行时候会持有管程，其他线程无法再获取同一个管程

### 1.6用户线程和守护线程 

**用户线程:**平时用到的普通线程,自定义线程

**守护线程:**运行在后台,是一种特殊的线程,比如垃圾回收

**当主线程结束后,用户线程还在运行,JVM 存活如果没有用户线程,都是守护线程,JVM 结束**

## 2 Lock接口 

### 2.1 Synchronized 

#### 2.1.1 Synchronized关键字回顾 

synchronized 是 Java 中的关键字，是一种同步锁。它修饰的对象有以下几种：

1. 修饰一个代码块，被修饰的代码块称为同步语句块，其作用的范围是大括号{} 括起来的代码，作用的对象是**调用这个代码块的对象**；

2. 修饰一个方法，被修饰的方法称为同步方法，其作用的范围是整个方法，作用的对象是**调用这个方法的对象**；

3. 虽然可以使用 synchronized 来定义方法，但 synchronized 并不属于方法定义的一部分，因此，synchronized 关键字不能被继承。如果在父类中的某个方法使用了 synchronized 关键字，而在子类中覆盖了这个方法，在子类中的这个方法默认情况下并不是同步的，而必须**显式地在子类的这个方法中加上synchronized 关键字**才可以。当然，还可以在子类方法中调用父类中相应的方法，这样虽然子类中的方法不是同步的，但子类调用了父类的同步方法，因此，子类的方法也就相当于同步了。

4. 修改一个静态的方法，其作用的范围是整个静态方法，作用的对象是这个类的所有对象；

5. 修改一个类，其作用的范围是 synchronized 后面括号括起来的部分，作用主的对象是这个类的所有对象。

6. synchorized 修饰的方法在调用wait()方法时会释放锁,直到其他线程调用相同对象上的`notify()`或`notifyAll()`方法来唤醒等待的线程。

#### 2.1.2 售票案例 
```java
class Ticket { 
    //票数 
    private int number = 30; 
    //操作方法：卖票 
    public synchronized void sale() {
    //判断：是否有票         
    if(number > 0) { 
            System.out.println(Thread.currentThread().getName()+ ":" + "卖出：" + (number--)+ "剩下：" +number); 
        }
    }
}
```
如果一个代码块被 synchronized 修饰了，当一个线程获取了对应的锁，并执行该代码块时，其他线程便只能一直等待，等待获取锁的线程释放锁，而这里获取锁的线程释放锁只会有两种情况：

1. 获取锁的线程执行完了该代码块，然后线程释放对锁的占有；
2. 线程执行发生异常，此时 JVM 会让线程自动释放锁。

那么如果这个获取锁的线程由于要等待 IO 或者其他原因（比如调用 sleep 方法）被阻塞了，但是又没有释放锁，其他线程便只能干巴巴地等待，试想一下，这多么影响程序执行效率。

因此就需要有一种机制可以不让等待的线程一直无期限地等待下去（比如只等待一定的时间或者能够响应中断），通过 Lock 就可以办到。

### 2.2 什么是 Lock 

Lock 锁实现提供了比使用同步方法和语句可以获得的更广泛的锁操作。它们允许更灵活的结构，可能具有非常不同的属性，并且可能支持多个关联的条件对象。Lock 提供了比 synchronized 更多的功能。

Lock 与的 Synchronized 区别

- Lock 不是 Java 语言内置的，synchronized 是 Java 语言的关键字，因此是内置特性。Lock 是一个类，通过这个类可以实现同步访问；

- Lock 和 synchronized 有一点非常大的不同，采用 synchronized 不需要用户去手动释放锁，当 synchronized 方法或者 synchronized 代码块执行完之后，系统会自动让线程释放对锁的占用；而 Lock 则必须要用户去手动释放锁，如果没有主动释放锁，就有可能导致出现死锁现象。

#### 2.2.1 Lock 接口 

```java
package java.util.concurrent.locks;
import java.util.concurrent.TimeUnit;

public interface Lock {
    void lock();

    void lockInterruptibly() throws InterruptedException;

    boolean tryLock();

    boolean tryLock(long time, TimeUnit unit) throws InterruptedException;
    
    void unlock();

    Condition newCondition();
}

```

下面来逐个讲述 Lock 接口中每个方法的使用

#### 2.2.2 lock 

lock()方法是平常使用得最多的一个方法，就是用来获取锁。如果锁已被其他线程获取，则进行等待。

采用 Lock，必须主动去释放锁，并且在发生异常时，不会自动释放锁。因此一般来说，使用 Lock 必须在 try{}catch{}块中进行，并且将释放锁的操作放在 finally 块中进行，以保证锁一定被被释放，防止死锁的发生。通常使用 Lock 来进行同步的话，是以下面这种形式去使用的：

```java
Lock lock = ...;
lock.lock();
try{
//处理任务
}catch(Exception ex){
}finally{
lock.unlock(); //释放锁
}
```

#### 2.2.3 newCondition 

关键字 synchronized 与 wait()/notify()这两个方法一起使用可以实现等待/通知模式， Lock 锁的 newContition()方法返回 Condition 对象，Condition 类也可以实现等待/通知模式。

用 notify()通知时，JVM 会随机唤醒某个等待的线程， 使用 Condition 类可以进行选择性通知， Condition 比较常用的两个方法：

- await()会使当前线程等待,同时会释放锁,当其他线程调用 signal()时,线程会重新获得锁并继续执行。

- signal()用于唤醒一个等待的线程。

> ==注意：在调用 Condition 的 await()/signal()方法前，也需要线程持有相关的 Lock 锁，调用 await()后线程会释放这个锁，在 singal()调用后会从当前 Condition 对象的等待队列中，唤醒 一个线程，唤醒的线程尝试获得锁， 一旦获得锁成功就继续执行。==

### 2.3 ReentrantLock 

ReentrantLock，意思是“可重入锁”，关于可重入锁的概念将在后面讲述。

ReentrantLock 是唯一实现了 Lock 接口的类，并且 ReentrantLock 提供了更多的方法。下面通过一些实例看具体看一下如何使用。

```java
package com.atguigu.sync;

public class Test {
    private ArrayList<Integer> arrayList = new ArrayList<Integer>();

    public static void main(String[] args) {
        final Test test = new Test();
        new Thread() {
            public void run() {
                test.insert(Thread.currentThread());
            }
        }.start();
        new Thread() {
            public void run() {
                test.insert(Thread.currentThread());
            }
        }.start();
    }

    public void insert(Thread thread) {
        Lock lock = new ReentrantLock(); // 注意这个地方
        lock.lock();
        try {
            System.out.println(thread.getName() + "得到了锁");
            for (int i = 0; i < 5; i++) {
                arrayList.add(i);
            }
        } catch (Exception e) {
// TODO: handle exception
        } finally {
            System.out.println(thread.getName() + "释放了锁");
            lock.unlock();
        }
    }
}
```



### 2.4 ReadWriteLock 

ReadWriteLock 也是一个接口，在它里面只定义了两个方法：

```java
public interface ReadWriteLock {

	/**
	 * Returns the lock used for reading.
	 * @return the lock used for reading.
	 */
	Lock readLock();

	/**
	 * Returns the lock used for writing.
	 * @return the lock used for writing.
	 */
	Lock writeLock();

}
```
一个用来获取读锁，一个用来获取写锁。也就是说将文件的读写操作分开，分成 2 个锁来分配给线程，从而使得多个线程可以同时进行读操作。

下面的**ReentrantReadWriteLock** 实现了 ReadWriteLock 接口。

ReentrantReadWriteLock 里面提供了很多丰富的方法，不过最主要的有两个方法：readLock()和 writeLock()用来获取读锁和写锁。下面通过几个例子来看一下 ReentrantReadWriteLock 具体用法。

假如有多个线程要同时进行读操作的话，先看一下 synchronized 达到的效果：

```java
package com.atguigu.sync;

public class Test {
    private ReentrantReadWriteLock rwl = new
            ReentrantReadWriteLock();

    public static void main(String[] args) {
        final Test test = new Test();
        new Thread() {
            public void run() {
                test.get(Thread.currentThread());
            }
        }.start();
        new Thread() {
            public void run() {
                test.get(Thread.currentThread());
            }
        }.start();
    }

    public synchronized void get(Thread thread) {
        long start = System.currentTimeMillis();
        while (System.currentTimeMillis() - start <= 1) {
            System.out.println(thread.getName() + "正在进行读操作");
        }
        System.out.println(thread.getName() + "读操作完毕");
    }
}
```



而改成用读写锁的话：

```java
public class Test {
    private ReentrantReadWriteLock rwl = new
            ReentrantReadWriteLock();

    public static void main(String[] args) {
        final Test test = new Test();
        new Thread() {
            public void run() {
                test.get(Thread.currentThread());
            }
        }.start();
        new Thread() {
            public void run() {
                test.get(Thread.currentThread());
            }
        }.start();
    }

    public void get(Thread thread) {
        rwl.readLock().lock();
        try {
            long start = System.currentTimeMillis();
            while (System.currentTimeMillis() - start <= 1) {
                System.out.println(thread.getName() + "正在进行读操作");
            }
            System.out.println(thread.getName() + "读操作完毕");
        } finally {
            rwl.readLock().unlock();
        }
    }
}
```



说明 thread1 和 thread2 在同时进行读操作。这样就大大提升了读操作的效率。

**注意:**

- 如果有一个线程已经占用了读锁，则此时其他线程如果要申请写锁，则申请写锁的线程会一直等待释放读锁。

- 如果有一个线程已经占用了写锁，则此时其他线程如果申请写锁或者读锁，则申请的线程会一直等待释放写锁。

### 2.5 小结(重点) 

Lock 和 synchronized 有以下几点不同：

1.   Lock 是一个接口，而 synchronized 是 Java 中的关键字，synchronized 是内置的语言实现；

2.   synchronized 在发生异常时，会自动释放线程占有的锁，因此不会导致死锁现象发生；而 Lock 在发生异常时，如果没有主动通过 unLock()去释放锁，则很可能造成死锁现象，因此使用 Lock 时需要在 finally 块中释放锁；

3.   Lock 可以让等待锁的线程响应中断，而 synchronized 却不行，使用 synchronized 时，等待的线程会一直等待下去，不能够响应中断；

4.   通过 Lock 可以知道有没有成功获取锁，而 synchronized 却无法办到。

5.   Lock 可以提高多个线程进行读操作的效率。

在性能上来说，如果竞争资源不激烈，两者的性能是差不多的，而当竞争资源非常激烈时（即有大量线程同时竞争），此时 Lock 的性能要远远优于 synchronized。

## 3 线程间通信 

线程间通信的模型有两种：共享内存和消息传递，以下方式都是基本这两种模型来实现的。我们来基本一道面试常见的题目来分析

> **场景---两个线程，一个线程对当前数值加 1，另一个线程对当前数值减 1,要求用线程间通信**

### 3.1 synchronized方案 

```java
package com.atguigu.test;

/**
 * volatile 关键字实现线程交替加减
 */
public class TestVolatile {
    /**
     * 交替加减
     *
     * @param args
     */
    public static void main(String[] args) {
        DemoClass demoClass = new DemoClass();
        new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                demoClass.increment();
            }
        }, "线程 A").start();
        new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                demoClass.decrement();
            }
        }, "线程 B").start();
    }
}
package com.atguigu.test;

class DemoClass {
    // 加减对象
    private int number = 0;

    /**
     * 加 1
     */
    public synchronized void increment() {
        try {
            while (number != 0) {
                this.wait();
            }
            number++;
            System.out.println("--------" + Thread.currentThread().getName() + "加一成
                    功----------, 值为:" + number);
            notifyAll();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 减一
     */
    public synchronized void decrement() {
        try {
            while (number == 0) {
                this.wait();
            }
            number--;
            System.out.println("--------" + Thread.currentThread().getName() + "减一成
                    功----------, 值为:" + number);
            notifyAll();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

不加`while`使用`if`会导致虚假唤醒。

### 3.2 Lock方案

```java
package com.atguigu.test;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class DemoClass {
    // 加减对象
    private int number = 0;
    // 声明锁
    private Lock lock = new ReentrantLock();
    // 声明钥匙
    private Condition condition = lock.newCondition();

    /**
     * 加 1
     */
    public void increment() {
        try {
            lock.lock();
            while (number != 0) {
                condition.await();
            }
            number++;
            System.out.println("--------" + Thread.currentThread().getName() + "加一成
                    功----------, 值为:" + number);
            condition.signalAll();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    /**
     * 减一
     */
    public void decrement() {
        try {
            lock.lock();
            while (number == 0) {
                condition.await();
            }
            number--;
            System.out.println("--------" + Thread.currentThread().getName() + "减一成
                    功----------, 值为:" + number);
            condition.signalAll();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```



### 3.3 线程间定制化通信 

#### 3.3.1 案例介绍 

> 问题: A 线程打印 5 次 A，B 线程打印 10 次 B，C 线程打印 15 次 C,按照此顺序循环 10 轮5 次

```java
package com.atguigu.lock;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

//第一步 创建资源类
class ShareResource {
    //定义标志位
    private int flag = 1;  // 1 AA     2 BB     3 CC

    //创建Lock锁
    private Lock lock = new ReentrantLock();

    //创建三个condition
    private Condition c1 = lock.newCondition();
    private Condition c2 = lock.newCondition();
    private Condition c3 = lock.newCondition();

    //打印5次，参数第几轮
    public void print5(int loop) throws InterruptedException {
        //上锁
        lock.lock();
        try {
            //判断
            while(flag != 1) {
                //等待
                c1.await();
            }
            //干活
            for (int i = 1; i <=5; i++) {
                System.out.println(Thread.currentThread().getName()+" :: "+i+" ：轮数："+loop);
            }
            //通知
            flag = 2; //修改标志位 2
            c2.signal(); //通知BB线程
        }finally {
            //释放锁
            lock.unlock();
        }
    }

    //打印10次，参数第几轮
    public void print10(int loop) throws InterruptedException {
        lock.lock();
        try {
            while(flag != 2) {
                c2.await();
            }
            for (int i = 1; i <=10; i++) {
                System.out.println(Thread.currentThread().getName()+" :: "+i+" ：轮数："+loop);
            }
            //修改标志位
            flag = 3;
            //通知CC线程
            c3.signal();
        }finally {
            lock.unlock();
        }
    }

    //打印15次，参数第几轮
    public void print15(int loop) throws InterruptedException {
        lock.lock();
        try {
            while(flag != 3) {
                c3.await();
            }
            for (int i = 1; i <=15; i++) {
                System.out.println(Thread.currentThread().getName()+" :: "+i+" ：轮数："+loop);
            }
            //修改标志位
            flag = 1;
            //通知AA线程
            c1.signal();
        }finally {
            lock.unlock();
        }
    }
}

public class ThreadDemo3 {
    public static void main(String[] args) {
        ShareResource shareResource = new ShareResource();
        new Thread(()->{
            for (int i = 1; i <=10; i++) {
                try {
                    shareResource.print5(i);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"AA").start();

        new Thread(()->{
            for (int i = 1; i <=10; i++) {
                try {
                    shareResource.print10(i);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"BB").start();

        new Thread(()->{
            for (int i = 1; i <=10; i++) {
                try {
                    shareResource.print15(i);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"CC").start();
    }
}

```

synchronized实现同步的基础：Java中的每一个对象都可以作为锁具体表现为以下3种形式。
1. 对于普通同步方法，锁是当前实例对象。
2. 对于静态同步方法，锁是当前类的class对象。
3. 对于同步方法块，锁是synchonized括号里配置的对象。

## 4 集合的线程安全 

### 4.1 集合操作Demo 

NotSafeDemo

```java
package com.atguigu.test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 集合线程安全案例
 */
public class NotSafeDemo {
    /**
     * 多个线程同时对集合进行修改
     *
     * @param args
     */
    public static void main(String[] args) {
        List list = new ArrayList();
        for (int i = 0; i < 100; i++) {
            new Thread(() -> {
                list.add(UUID.randomUUID().toString());
                System.out.println(list);
            }, "线程" + i).start();
        }
    }
}
```

异常内容

java.util.ConcurrentModificationException

**问题: 为什么会出现并发修改异常?** 查看 ArrayList 的 add 方法源码

```java
/**
* Appends the specified element to the end of this list.
*
* @param e element to be appended to this list
* @return <tt>true</tt> (as specified by {@link Collection#add})
*/
public boolean add(E e) {
    ensureCapacityInternal(size + 1); // Increments modCount!!
    elementData[size++] = e;
    return true;
}
```

> ==**那么我们如何去解决 List 类型的线程安全问题?**==

### 4.2 Vector 

> Vector 是**矢量队列**，它是 JDK1.0 版本添加的类。继承于 AbstractList，实现
>
> 了 List, RandomAccess, Cloneable 这些接口。 Vector 继承了 AbstractList，
>
> 实现了 List；所以，**它是一个队列，支持相关的添加、删除、修改、遍历等功能**。 Vector 实现了 RandmoAccess 接口，即**提供了随机访问功能**。 RandmoAccess 是 java 中用来被 List 实现，为 List 提供快速访问功能的。在 Vector 中，我们即可以通过元素的序号快速获取元素对象；这就是快速随机访问。 Vector 实现了 Cloneable 接口，即实现 clone()函数。它能被克隆。

==和 ArrayList 不同，Vector 中的操作是线程安全的。==

NotSafeDemo 代码修改

```java
package com.atguigu.test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Vector;

/**
 * 集合线程安全案例
 */
public class NotSafeDemo {
    /**
     * 多个线程同时对集合进行修改
     *
     * @param args
     */
    public static void main(String[] args) {
        List list = new Vector();
        for (int i = 0; i < 100; i++) {
            new Thread(() -> {
                list.add(UUID.randomUUID().toString());
                System.out.println(list);
            }, "线程" + i).start();
        }
    }
}
```

**现在没有运行出现并发异常,为什么?** 查看 Vector 的 add 方法

```java
/**
* Appends the specified element to the end of this Vector.
*
* @param e element to be appended to this Vector
* @return {@code true} (as specified by {@link Collection#add})
* @since 1.2
*/
public synchronized boolean add(E e) {
    modCount++;
    ensureCapacityHelper(elementCount + 1);
    elementData[elementCount++] = e;
    return true;
}
```

add 方法被 synchronized 同步修辞,线程安全!因此没有并发异常.

### 4.3 Collections 

Collections 提供了方法 synchronizedList 保证 list 是同步线程安全的 NotSafeDemo 代码修改

```java
package com.atguigu.test;
import java.util.*;
/**
 * 集合线程安全案例
 */
public class NotSafeDemo {
    /**
     * 多个线程同时对集合进行修改
     * @param args
     */
    public static void main(String[] args) {
        List list = Collections.synchronizedList(new ArrayList<>());
        for (int i = 0; i < 100; i++) {
            new Thread(() ->{
                list.add(UUID.randomUUID().toString());
                System.out.println(list);
            }, "线程" + i).start();
        }
    }
}
```



没有并发修改异常查看方法源码

```java
/**
* Returns a synchronized (thread-safe) list backed by the specified
* list. In order to guarantee serial access, it is critical that
* <strong>all</strong> access to the backing list is accomplished
* through the returned list.<p>
*
* It is imperative that the user manually synchronize on the returned
* list when iterating over it:
* <pre>
* List list = Collections.synchronizedList(new ArrayList());
* ...
* synchronized (list) {
* Iterator i = list.iterator(); // Must be in synchronized block
* while (i.hasNext())
* foo(i.next());
* }
* </pre>
* Failure to follow this advice may result in non-deterministic behavior.
*
* <p>The returned list will be serializable if the specified list is
* serializable.
*
* @param <T> the class of the objects in the list
* @param list the list to be "wrapped" in a synchronized list.
* @return a synchronized view of the specified list.
*/
public static <T> List<T> synchronizedList(List<T> list) {
    return (list instanceof RandomAccess ?
    new SynchronizedRandomAccessList<>(list) :
    new SynchronizedList<>(list));
}
```

### 4.4 CopyOnWriteArrayList(重点) 

首先我们对 CopyOnWriteArrayList 进行学习,它相当于线程安全的 ArrayList。和 ArrayList 一样，它是个可变数组；但是和ArrayList 不同的时，它具有以下特性：

1.  它最适合于具有以下特征的应用程序：List 大小通常保持很小，只读操作远多于可变操作，需要在遍历期间防止线程间的冲突。

2.  它是线程安全的。

3.  因为通常需要复制整个基础数组，所以可变操作（add()、set() 和 remove() 等等）的开销很大。

4.  迭代器支持 hasNext(), next()等不可变操作，但不支持可变 remove()等操作。

5.  使用迭代器进行遍历的速度很快，并且不会与其他线程发生冲突。在构造迭代器时，迭代器依赖于不变的数组快照。

    1.  **独占锁效率低：采用读写分离思想解决**

    2.  **写线程获取到锁，其他写线程阻塞**

    3.  **复制思想：**当我们往一个容器添加元素的时候，不直接往当前容器添加，而是先将当前容器进行 Copy，复制出一个新的容器，然后新的容器里添加元素，添加完元素之后，再将原容器的引用指向新的容器。

> **这时候会抛出来一个新的问题，也就是数据不一致的问题。如果写线程还没来得及写会内存，其他的线程就会读到了脏数据。**

==**这就是 CopyOnWriteArrayList 的思想和原理。就是拷贝一份。**== 

NotSafeDemo 代码修改

```java
package com.atguigu.test; 
 
import java.util.*; import java.util.concurrent.CopyOnWriteArrayList; 
 
/** 
*	集合线程安全案例 
*/ 
public class NotSafeDemo { 
 
   /** 
*	多个线程同时对集合进行修改 
*	@param args 
    */ 
   public static void main(String[] args) {        
       List list = new CopyOnWriteArrayList();        
       for (int i = 0; i < 100; i++) {            
           new Thread(() ->{ 
                   list.add(UUID.randomUUID().toString()); 
               System.out.println(list); 
          }, "线程" + i).start(); 
      } 
  } 
} 

```



> 没有线程安全问题
>
> **原因分析**(**重点**):**动态数组与线程安全**
>
> 下面从“动态数组”和“线程安全”两个方面进一步对
>
> CopyOnWriteArrayList 的原理进行说明。

• **“动态数组”机制**

它内部有个“volatile 数组”(array)来保持数据。在“添加/修改/删除”数据时，都会新建一个数组，并将更新后的数据拷贝到新建的数组中，最后再将该数组赋值给“volatile 数组”, 这就是它叫做 CopyOnWriteArrayList 的原因 .**由于它在“添加/修改/删除”数据时，都会新建数组，所以涉及到修改数据的操作，CopyOnWriteArrayList 效率很低；但是单单只是进行遍历查找的话，效率比较高。**

• **“线程安全”机制**

- 通过 volatile 和互斥锁来实现的。

- 通过“volatile 数组”来保存数据的。一个线程读取 volatile 数组时，总能看到其它线程对该 volatile 变量最后的写入；就这样，通过 volatile 提供了“读取到的数据总是最新的”这个机制的保证。

- 通过互斥锁来保护数据。在“添加/修改/删除”数据时，会先“获取互斥锁”，再修改完毕之后，先将数据更新到“volatile 数组”中，然后再“释放互斥锁”，就达到了保护数据的目的。

### 4.5 小结(重点) 

#### 1.线程安全与线程不安全集合

集合类型中存在线程安全与线程不安全的两种,常见例如:
ArrayList ----- Vector
HashMap -----HashTable

但是以上都是通过 synchronized 关键字实现,效率较低

#### 2.Collections 构建的线程安全集合

#### 3.java.util.concurrent 并发包下

CopyOnWriteArrayList CopyOnWriteArraySet 类型,通过动态数组与线程安全个方面保证线程安全

## 5 多线程锁 

### 5.1 锁的八个问题演示 

```java
class Phone { 
    public static synchronized void sendSMS() throws Exception { 
        //停留4秒 
        TimeUnit.SECONDS.sleep(4); 
        System.out.println("------sendSMS"); 
    }  
    public synchronized void sendEmail() throws Exception { 
        System.out.println("------sendEmail"); 
    }  
    public void getHello() { 
        System.out.println("------getHello"); 
    } 
} 
/** 
 * @Description: 8锁 
 * 
1	标准访问，先打印短信还是邮件 
------sendSMS 
------sendEmail 
 
2	停 4秒在短信方法内，先打印短信还是邮件 
------sendSMS 
------sendEmail 
 
3	新增普通的 hello方法，是先打短信还是 hello 
------getHello 
------sendSMS 
 
4	现在有两部手机，先打印短信还是邮件 
------sendEmail 
------sendSMS 
 
5	两个静态同步方法，1部手机，先打印短信还是邮件 
------sendSMS 
------sendEmail 
 
6	两个静态同步方法，2部手机，先打印短信还是邮件 
------sendSMS 
------sendEmail 
 
7	1个静态同步方法,1个普通同步方法，1部手机，先打印短信还是邮件 
------sendEmail 
------sendSMS 
 
8	1个静态同步方法,1个普通同步方法，2部手机，先打印短信还是邮件 
------sendEmail 
------sendSMS 
```

**结论:**

一个对象里面如果有多个 synchronized 方法，某一个时刻内，只要一个线程去调用其中的一个 synchronized 方法了，其它的线程都只能等待，换句话说，某一个时刻内，只能有唯一一个线程去访问这些 synchronized 方法锁的是当前对象 this，被锁定后，其它的线程都不能进入到当前对象的其它的 synchronized 方法加个普通方法后发现和同步锁无关换成两个对象后，不是同一把锁了，情况立刻变化。

synchronized 实现同步的基础：Java中的每一个对象都可以作为锁。
**具体表现为以下 3 种形式。**
**对于普通同步方法，锁是当前实例对象。**
**对于静态同步方法，锁是当前类的 Class 对象。**
**对于同步方法块，锁是 Synchonized 括号里配置的对象**

当一个线程试图访问同步代码块时，它首先必须得到锁，退出或抛出异常时必须释放锁。
也就是说如果一个实例对象的非静态同步方法获取锁后，该实例对象的其他非静态同步方法必须等待获取锁的方法释放锁后才能获取锁，可是别的实例对象的非静态同步方法因为跟该实例对象的非静态同步方法用的是不同的锁，所以毋须等待该实例对象已获取锁的非静态同步方法释放锁就可以获取他们自己的锁。

所有的静态同步方法用的也是同一把锁——类对象本身，这两把锁是两个不同的对象，所以静态同步方法与非静态同步方法之间是不会有竞态条件的。
但是一旦一个静态同步方法获取锁后，其他的静态同步方法都必须等待该方法释放锁后才能获取锁，而不管是同一个实例对象的静态同步方法之间，还是不同的实例对象的静态同步方法之间，只要它们同一个类的实例对象！

## 6 Callable&Future接口

### 6.1 Callable接口

目前我们学习了有两种创建线程的方法-一种是通过创建 Thread 类，另一种是通过使用 Runnable 创建线程。但是，Runnable 缺少的一项功能是，当线程终止时（即 run（）完成时），我们无法使线程返回结果。为了支持此功能，Java 中提供了 Callable 接口。
==现在我们学习的是创建线程的第三种方案---Callable 接口==

#### **Callable 接口的特点如下(重点)** 

- 为了实现 Runnable，需要实现不返回任何内容的 run（）方法，而对于Callable，需要实现在完成时返回结果的 call（）方法。

- call（）方法可以引发异常，而 run（）则不能。

- 为实现 Callable 而必须重写 call 方法.

- 不能直接替换 runnable,因为 Thread 类的构造方法根本没有 Callable.

```java
创建新类 MyThread 实现 runnable 接口 
class MyThread implements Runnable{ 
 @Override 
 public void run() {} 
} 
新类 MyThread2 实现 callable 接口 
class MyThread2 implements Callable<Integer>{ 
 @Override  public Integer call() throws Exception {   
     return 200; 
 }  
}
```



### 6.2 Future接口 

当 call（）方法完成时，结果必须存储在主线程已知的对象中，以便主线程可以知道该线程返回的结果。为此，可以使用 Future 对象。

将 Future 视为保存结果的对象–它可能暂时不保存结果，但将来会保存（一旦 Callable 返回）。Future 基本上是主线程可以跟踪进度以及其他线程的结果的一种方式。要实现此接口，必须重写 5 种方法，这里列出了重要的方法,如下:

- public boolean cancel（boolean mayInterrupt）：用于停止任务。

  如果尚未启动，它将停止任务。如果已启动，则仅在 mayInterrupt 为 true 时才会中断任务。

- public Object get（）抛出 InterruptedException，ExecutionException：用于获取任务的结果。

  如果任务完成，它将立即返回结果，否则将等待任务完成，然后返回结果。

• public boolean isDone（）：如果任务完成，则返回 true，否则返回 false 

可以看到 Callable 和 Future 做两件事-Callable 与 Runnable 类似，因为它封装了要在另一个线程上运行的任务，而 Future 用于存储从另一个线程获得的结果。实际上，future 也可以与 Runnable 一起使用。要创建线程，需要 Runnable。为了获得结果，需要 future。

### 6.3 FutureTask 

Java 库具有具体的 FutureTask 类型，该类型实现 Runnable 和 Future，并方便地将两种功能组合在一起。 可以通过为其构造函数提供 Callable 来创建 FutureTask。然后，将 FutureTask 对象提供给 Thread 的构造函数以创建Thread 对象。因此，间接地使用 Callable 创建线程。

**核心原理:(重点)**
在主线程中需要执行比较耗时的操作时，但又不想阻塞主线程时，可以把这些作业交给 Future 对象在后台完成

- 当主线程将来需要时，就可以通过 Future 对象获得后台作业的计算结果或者执行状态.

- 一般 FutureTask 多用于耗时的计算，主线程可以在完成自己的任务后，再去获取结果。

- 仅在计算完成时才能检索结果；如果计算尚未完成，则**阻塞 get 方法.**

- 一旦计算完成，就不能再重新开始或取消计算.

- get 方法而获取结果只有在计算完成时获取，否则会一直阻塞直到任务转入完成状态，然后会返回结果或者抛出异常

- get 只计算**一次**,因此 get 方法放到最后.
  

### 6.4 使用Callable和Future 

  ```java
  package com.atguigu.sync;
  /**
   * CallableDemo 案列
   */
  public class CallableDemo {
      /**
       * 实现 runnable 接口
       */
      static class MyThread1 implements Runnable {
          @Override
          public void run() {
              try {
                  System.out.println(Thread.currentThread().getName() + "线程进入了 run 方法");
              } catch (Exception e) {
                  e.printStackTrace();
              }
          }
      }
  
      /**
       * 实现 callable 接口
       */
      static class MyThread2 implements Callable {
          /**
           * call 方法
           * @return
           * @throws Exception
           */
          @Override
          public Long call() throws Exception {
              try {
                  System.out.println(Thread.currentThread().getName() + "线程进入了 call 方法,开始准备睡觉");
                  Thread.sleep(1000);
                  System.out.println(Thread.currentThread().getName() + "睡醒了");
              } catch (Exception e) {
                  e.printStackTrace();
              }
              return System.currentTimeMillis();
          }
      }
  
      public static void main(String[] args) throws Exception {
          // 声明 runable 
          Runnable runable = new MyThread1();
          // 声明 callable 
          Callable callable = new MyThread2();
          // future-callable 
          FutureTask<Long> futureTask2 = new FutureTask(callable);
          // 线程二         new Thread(futureTask2, "线程二").start(); 
          for (int i = 0; i < 10; i++) {
              Long result1 = futureTask2.get();
              System.out.println(result1);
          }
          // 线程一         new Thread(runable,"线程一").start(); 
      }
  } 
  ```



### 6.5 小结(重点) 

- 在主线程中需要执行比较耗时的操作时，但又不想阻塞主线程时，可以把这些作业交给 Future 对象在后台完成, 当主线程将来需要时，就可以通过 Future 对象获得后台作业的计算结果或者执行状态

- 一般 FutureTask 多用于耗时的计算，主线程可以在完成自己的任务后，再去获取结果

- 仅在计算完成时才能检索结果；如果计算尚未完成，则阻塞 get 方法。一旦计算完成，就不能再重新开始或取消计算。get 方法而获取结果只有在计算完成时获取，否则会一直阻塞直到任务转入完成状态，然后会返回结果或者抛出异常。

- 只计算一次

## 7 JUC三大辅助类 

JUC 中提供了三种常用的辅助类，通过这些辅助类可以很好的解决线程数量过多时 Lock 锁的频繁操作。这三种辅助类为：

- CountDownLatch: 减少计数

- CyclicBarrier: 循环栅栏

- Semaphore: 信号灯

下面我们分别进行详细的介绍和学习

### 7.1 减少计数CountDownLatch 

CountDownLatch 类可以设置一个计数器，然后通过 countDown 方法来进行减 1 的操作，使用 await 方法等待计数器不大于 0，然后继续执行 await 方法之后的语句。

- CountDownLatch 主要有两个方法，当一个或多个线程调用 await 方法时，这些线程会阻塞

- 其它线程调用 countDown 方法会将计数器减 1(调用 countDown 方法的线程不会阻塞)

- 当计数器的值变为 0 时，因 await 方法阻塞的线程会被唤醒，继续执行

**场景: 6 个同学陆续离开教室后值班同学才可以关门。**

CountDownLatchDemo

```java
package com.atguigu.test;

import java.util.concurrent.CountDownLatch;

/**
 * CountDownLatchDemo
 */
public class CountDownLatchDemo {

    /**
     * 6 个同学陆续离开教室后值班同学才可以关门
     *
     * @param args
     */
    public static void main(String[] args) throws Exception {
        // 定义一个数值为 6 的计数器 
        CountDownLatch countDownLatch = new CountDownLatch(6);

        // 创建 6 个同学 
        for (int i = 1; i <= 6; i++) {
            new Thread(() -> {
                try {
                    if (Thread.currentThread().getName().equals("同学 6")) {
                        Thread.sleep(2000);
                    }
                    System.out.println(Thread.currentThread().getName() + "离开了");
                    // 计数器减一,不会阻塞 
                    countDownLatch.countDown();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }, "同学" + i).start();
        }
        // 主线程 await 休息 
        System.out.println("主线程睡觉");
        countDownLatch.await();
        // 全部离开后自动唤醒主线程 
        System.out.println("全部离开了,现在的计数器为" + countDownLatch.getCount());
    }
} 
```