class Main {
    public static void main(String[] args) {
        int n = 16;

        int a = 0;
        for (int i = 0; i < n; i++) a++; // i++ -> O(n)

        int b = 0;
        for (int i = 1; i < n; i *= 2) b++; // i *= 2 -> O(log n)

        int c = 0;
        for (int x = 0; x < n; x++) for (int y = 0; y < n; y++) c++; // n x n -> O(n^2)

        int d = 0;
        for (int x = 0; x < n; x++) for (int y = x + 1; y < n; y++) d++; // n(n-1)/2 -> phir bhi O(n^2)

        int e = 0;
        for (int k = 1; k * k <= n; k++) e++; // k^2 <= n -> O(sqrt n)

        System.out.println("n: " + a + ", log n: " + b + ", n^2: " + c + ", n(n-1)/2: " + d + ", sqrt n: " + e);
    }
}

// Output:
// n: 16, log n: 4, n^2: 256, n(n-1)/2: 120, sqrt n: 4
