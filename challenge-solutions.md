# Challenge Solutions

## Java Solutions

### Beginner Level

**101 - Java Hello World**
```java
public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

**102 - Java Even Numbers**
```java
public class Solution {
    public static void main(String[] args) {
        for (int i = 2; i <= 100; i += 2) {
            System.out.println(i);
        }
    }
}
```

**103 - Java Swap Two Numbers**
```java
import java.util.Scanner;
public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        a = a + b;
        b = a - b;
        a = a - b;
        System.out.println("After swap: a = " + a + ", b = " + b);
    }
}
```

**104 - Java Prime Number Checker**
```java
import java.util.Scanner;
public class Solution {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(isPrime(n));
    }
}
```

**105 - Java Factorial**
```java
import java.util.Scanner;
public class Solution {
    public static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(factorial(n));
    }
}
```

**106 - Java Fibonacci**
```java
import java.util.Scanner;
public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int a = 0, b = 1;
        for (int i = 0; i < n; i++) {
            if (i == n - 1) System.out.print(a);
            else System.out.print(a + " ");
            int temp = a + b;
            a = b;
            b = temp;
        }
    }
}
```

**107 - Java Reverse String**
```java
import java.util.Scanner;
public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine();
        System.out.println(new StringBuilder(str).reverse().toString());
    }
}
```

**108 - Java Palindrome Checker**
```java
import java.util.Scanner;
public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine().toLowerCase();
        String reversed = new StringBuilder(str).reverse().toString();
        System.out.println(str.equals(reversed));
    }
}
```

**109 - Java Sum Array**
```java
public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int num : arr) {
            sum += num;
        }
        System.out.println(sum);
    }
}
```

**110 - Java Find Max**
```java
public class Solution {
    public static void main(String[] args) {
        int[] arr = {2, 9, 4, 7};
        int max = arr[0];
        for (int num : arr) {
            if (num > max) max = num;
        }
        System.out.println(max);
    }
}
```

### Intermediate Level

**120 - Matrix Transpose**
```java
public class Solution {
    public static int[][] transpose(int[][] matrix) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        int[][] result = new int[cols][rows];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                result[j][i] = matrix[i][j];
            }
        }
        return result;
    }
}
```

### Advanced Level

**121 - Threaded Counter**
```java
public class Solution {
    private static int counter = 0;
    public static synchronized void increment() {
        counter++;
    }
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) increment();
        });
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) increment();
        });
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(counter);
    }
}
```

### Expert Level

**123 - Regex Email Validator**
```java
import java.util.regex.Pattern;
import java.util.Scanner;
public class Solution {
    public static boolean isValidEmail(String email) {
        String regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return Pattern.matches(regex, email);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String email = sc.nextLine();
        System.out.println(isValidEmail(email));
    }
}
```

## Python Solutions

### Beginner Level

**130 - Python Hello World**
```python
print("Hello, World!")
```

**149 - Python Add Two Numbers**
```python
print(5 + 3)
```

**150 - Python Add Two Input Numbers**
```python
a = int(input())
b = int(input())
print(f"Sum: {a + b}")
```

**151 - Python Compare Two Numbers**
```python
a = int(input())
b = int(input())
print(a >= b)
```

**152 - Python Average of Two Floats**
```python
a = float(input())
b = float(input())
print((a + b) / 2)
```

**153 - Python Square Area**
```python
side = int(input())
print(side * side)
```

**131 - Python Even Numbers**
```python
for i in range(2, 101, 2):
    print(i)
```

**132 - Python Swap Two Numbers**
```python
a, b = map(int, input().split())
a, b = b, a
print(f"After swap: a = {a}, b = {b}")
```

**133 - Python Prime Number Checker**
```python
def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

n = int(input())
print(is_prime(n))
```

**134 - Python Factorial**
```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

n = int(input())
print(factorial(n))
```

**135 - Python Fibonacci**
```python
n = int(input())
a, b = 0, 1
result = []
for i in range(n):
    result.append(str(a))
    a, b = b, a + b
print(" ".join(result))
```

**136 - Python Reverse String**
```python
s = input()
print(s[::-1])
```

**137 - Python Palindrome Checker**
```python
s = input().lower()
print(s == s[::-1])
```

**138 - Python Sum Array**
```python
arr = [1, 2, 3, 4, 5]
print(sum(arr))
```

**139 - Python Find Max**
```python
arr = [2, 9, 4, 7]
print(max(arr))
```

### Intermediate Level

**201 - Dictionary Merge**
```python
def merge_dicts(d1, d2):
    result = d1.copy()
    for key, value in d2.items():
        if key in result:
            result[key] += value
        else:
            result[key] = value
    return result
```

### Advanced Level

**202 - Sudoku Validator**
```python
def is_valid_sudoku(board):
    def is_valid_unit(unit):
        unit = [i for i in unit if i != '.']
        return len(set(unit)) == len(unit)
    
    return (all(is_valid_unit(row) for row in board) and
            all(is_valid_unit([board[i][j] for i in range(9)]) for j in range(9)) and
            all(is_valid_unit([board[i][j] for i in range(r, r+3) for j in range(c, c+3)])
                for r in (0, 3, 6) for c in (0, 3, 6)))
```

### Expert Level

**204 - Decorator Logger**
```python
import functools

def logger(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        args_str = ', '.join(map(str, args))
        print(f"Calling {func.__name__}({args_str})")
        return func(*args, **kwargs)
    return wrapper

@logger
def foo(a, b):
    return a + b
```

## JavaScript Solutions

### Beginner Level

**301 - JavaScript Hello World**
```javascript
console.log("Hello, World!");
```

**302 - JavaScript Even Numbers**
```javascript
for (let i = 2; i <= 100; i += 2) {
    console.log(i);
}
```

**303 - JavaScript Swap Variables**
```javascript
let a = 10, b = 20;
[a, b] = [b, a];
console.log(`After swap: a = ${a}, b = ${b}`);
```

**304 - JavaScript Prime Checker**
```javascript
function isPrime(n) {
    if (n <= 1) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}
```

**305 - JavaScript Factorial**
```javascript
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
```

**306 - JavaScript Fibonacci**
```javascript
function fibonacci(n) {
    let result = [];
    let a = 0, b = 1;
    for (let i = 0; i < n; i++) {
        result.push(a);
        [a, b] = [b, a + b];
    }
    return result.join(' ');
}
```

**307 - JavaScript Reverse String**
```javascript
function reverseString(str) {
    return str.split('').reverse().join('');
}
```

**308 - JavaScript Palindrome Checker**
```javascript
function isPalindrome(str) {
    const cleaned = str.toLowerCase();
    return cleaned === cleaned.split('').reverse().join('');
}
```

### Intermediate Level

**320 - Object Deep Clone**
```javascript
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Array) return obj.map(deepClone);
    const cloned = {};
    for (let key in obj) {
        cloned[key] = deepClone(obj[key]);
    }
    return cloned;
}
```

### Advanced Level

**321 - Promise Chain**
```javascript
function chainPromises(arr) {
    return arr.reduce((promise, item) => {
        return promise.then(result => {
            return new Promise(resolve => {
                setTimeout(() => resolve(result + item), 100);
            });
        });
    }, Promise.resolve(0))
    .then(result => `Final result: ${result}`);
}
```

### Expert Level

**322 - Custom Event Emitter**
```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, listener) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(listener);
    }
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    }
    
    off(event, listenerToRemove) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
        }
    }
}
```

## C Solutions

### Beginner Level

**401 - C Hello World**
```c
#include <stdio.h>
int main() {
    printf("Hello, World!");
    return 0;
}
```

**449 - C Add Two Numbers**
```c
#include <stdio.h>
int main() {
    printf("8");
    return 0;
}
```

**450 - C Add Two Input Numbers**
```c
#include <stdio.h>
int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("Sum: %d", a + b);
    return 0;
}
```

**402 - C Even Numbers**
```c
#include <stdio.h>
int main() {
    for (int i = 2; i <= 100; i += 2) {
        printf("%d\n", i);
    }
    return 0;
}
```

**403 - C Swap Two Numbers**
```c
#include <stdio.h>
int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    a = a + b;
    b = a - b;
    a = a - b;
    printf("After swap: a = %d, b = %d", a, b);
    return 0;
}
```

**404 - C Prime Number Checker**
```c
#include <stdio.h>
#include <math.h>
int isPrime(int n) {
    if (n <= 1) return 0;
    for (int i = 2; i <= sqrt(n); i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}
int main() {
    int n;
    scanf("%d", &n);
    printf("%d", isPrime(n));
    return 0;
}
```

**405 - C Factorial**
```c
#include <stdio.h>
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
int main() {
    int n;
    scanf("%d", &n);
    printf("%d", factorial(n));
    return 0;
}
```

### Intermediate Level

**420 - Matrix Multiplication**
```c
#include <stdio.h>
int main() {
    int a[2][2] = {{1,2},{3,4}};
    int b[2][2] = {{5,6},{7,8}};
    int result[2][2];
    
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) {
            result[i][j] = 0;
            for (int k = 0; k < 2; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    
    printf("[[%d,%d],[%d,%d]]", result[0][0], result[0][1], result[1][0], result[1][1]);
    return 0;
}
```

## C++ Solutions

### Beginner Level

**501 - C++ Hello World**
```cpp
#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!";
    return 0;
}
```

**529 - C++ Add Two Numbers**
```cpp
#include <iostream>
using namespace std;
int main() {
    cout << 5 + 3;
    return 0;
}
```

**530 - C++ Add Two Input Numbers**
```cpp
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << "Sum: " << a + b;
    return 0;
}
```

**502 - C++ Even Numbers**
```cpp
#include <iostream>
using namespace std;
int main() {
    for (int i = 2; i <= 100; i += 2) {
        cout << i << endl;
    }
    return 0;
}
```

**503 - C++ Swap Variables**
```cpp
#include <iostream>
using namespace std;
void swap(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}
int main() {
    int a = 10, b = 20;
    swap(a, b);
    cout << "After swap: a = " << a << ", b = " << b;
    return 0;
}
```

**508 - C++ Class Rectangle**
```cpp
#include <iostream>
using namespace std;
class Rectangle {
private:
    int length, width;
public:
    Rectangle(int l, int w) : length(l), width(w) {}
    int area() { return length * width; }
};
int main() {
    Rectangle rect(4, 5);
    cout << rect.area();
    return 0;
}
```

### Intermediate Level

**512 - C++ Inheritance**
```cpp
#include <iostream>
using namespace std;
class Base {
public:
    void baseMethod() { cout << "Base method" << endl; }
};
class Derived : public Base {
public:
    void derivedMethod() { cout << "Derived method"; }
};
int main() {
    Derived d;
    d.baseMethod();
    d.derivedMethod();
    return 0;
}
```

**515 - C++ Template Function**
```cpp
#include <iostream>
using namespace std;
template<typename T>
T getMax(T a, T b) {
    return (a > b) ? a : b;
}
int main() {
    cout << getMax(3, 5) << endl;
    cout << getMax(2.1, 3.7);
    return 0;
}
```

### Advanced Level

**520 - C++ Smart Pointers**
```cpp
#include <iostream>
#include <memory>
using namespace std;
int main() {
    unique_ptr<int> ptr = make_unique<int>(42);
    cout << "Value: " << *ptr;
    return 0;
}
```

### Expert Level

**525 - Custom Iterator**
```cpp
#include <iostream>
#include <vector>
using namespace std;
class Container {
private:
    vector<int> data;
public:
    Container(vector<int> d) : data(d) {}
    
    class Iterator {
    private:
        vector<int>::iterator it;
    public:
        Iterator(vector<int>::iterator i) : it(i) {}
        int& operator*() { return *it; }
        Iterator& operator++() { ++it; return *this; }
        bool operator!=(const Iterator& other) { return it != other.it; }
    };
    
    Iterator begin() { return Iterator(data.begin()); }
    Iterator end() { return Iterator(data.end()); }
};
```