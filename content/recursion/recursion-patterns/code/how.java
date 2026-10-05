class Main {
    // Divide & conquer: array ko aadha karo, dono halves ka max lo, bada wala jeeta
    static int findMax(int[] a, int l, int r) {
        if (l == r) return a[l]; // ek hi item: wahi max //@base
        int mid = (l + r) / 2; // beech se todo //@split
        int left = findMax(a, l, mid); // left half ka max (bharosa)
        int right = findMax(a, mid + 1, r); // right half ka max
        return Math.max(left, right); // do jawab jodo //@combine
    }

    public static void main(String[] args) {
        int[] a = {3, 9, 2, 7, 5};
        System.out.println(findMax(a, 0, a.length - 1));
        System.out.println(findMax(new int[]{-4}, 0, 0));
    }
}

// Output:
// 9
// -4
