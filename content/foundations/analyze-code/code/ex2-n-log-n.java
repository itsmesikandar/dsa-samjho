class Main {
    // Bahar ka loop n baar; andar j har baar double -> log n baar. Total?
    static int countOps(int n) {
        int ops = 0;
        for (int i = 0; i < n; i++) { // n baar //@outer
            int j = 1;
            while (j < n) { // j = 1, 2, 4, 8... -> log n baar //@inner
                ops++;
                j *= 2;
            }
        }
        return ops; // n x log n //@done
    }

    public static void main(String[] args) {
        System.out.println(countOps(8)); // 8 x 3
        System.out.println(countOps(1024)); // 1024 x 10
    }
}

// Output:
// 24
// 10240
