class Main {
    // Kitne pairs (i < j) ka sum target ke barabar hai? Brute force: har pair check karo
    static int countPairs(int[] arr, int target) {
        int count = 0;
        for (int i = 0; i < arr.length; i++) { // bahar ka loop: n baar //@outer
            for (int j = i + 1; j < arr.length; j++) { // andar ka loop: i ke baad wale sab //@inner
                if (arr[i] + arr[j] == target) count++; //@check
            }
        }
        return count; //@done
    }

    public static void main(String[] args) {
        System.out.println(countPairs(new int[]{1, 5, 3, 3, 2}, 6));
        // n = 1000 ho to kitne checks? n(n-1)/2
        System.out.println(1000L * 999 / 2);
    }
}

// Output:
// 2
// 499500
