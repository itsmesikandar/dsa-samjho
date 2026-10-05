class Main {
    // Solution likhne ke baad hamesha edge cases se test karo
    static Double average(int[] arr) {
        if (arr.length == 0) return null; // edge case 1: khaali input
        long sum = 0; // edge case 2: bada sum -> long, warna overflow
        for (int x : arr) sum += x;
        return (double) sum / arr.length;
    }

    public static void main(String[] args) {
        System.out.println(average(new int[]{2, 4, 9})); // normal case
        System.out.println(average(new int[]{})); // khaali array
        System.out.println(average(new int[]{Integer.MAX_VALUE, Integer.MAX_VALUE})); // bade numbers
        System.out.println(average(new int[]{-3})); // ek hi item, negative
    }
}

// Output:
// 5.0
// null
// 2.147483647E9
// -3.0
