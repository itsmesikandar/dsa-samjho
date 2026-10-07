class Main {
    // 2 hisson wala function: pehle ek loop, phir nested loop. Total kaam kitna?
    static int analyze(int[] arr) {
        int count = 0;
        for (int x : arr) count++; // hissa 1: n baar //@p1
        for (int i = 0; i < arr.length; i++) { // hissa 2: bahar n baar...
            for (int j = 0; j < arr.length; j++) count++; // ...andar bhi n baar = n x n //@p2
        }
        return count; // n + n^2 //@done
    }

    public static void main(String[] args) {
        System.out.println(analyze(new int[4])); // 4 + 16
        System.out.println(analyze(new int[100])); // 100 + 10000
    }
}

// Output:
// 20
// 10100
