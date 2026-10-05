class Main {
    // Second largest (alag value). Na mile to -1.
    // Brute force: sort karke peeche se dekho -> O(n log n). Better: ek hi pass -> O(n).
    static int secondLargest(int[] arr) {
        int first = Integer.MIN_VALUE; // abhi tak ka sabse bada //@init
        int second = Integer.MIN_VALUE; // abhi tak ka doosra sabse bada
        for (int x : arr) { //@loop
            if (x > first) { // naya champion: purana champion ab second //@new-first
                second = first;
                first = x;
            } else if (x > second && x != first) { // champion se chhota, par second se bada //@new-second
                second = x;
            }
        }
        return second == Integer.MIN_VALUE ? -1 : second; //@done
    }

    public static void main(String[] args) {
        System.out.println(secondLargest(new int[]{12, 35, 1, 10, 34, 1}));
        System.out.println(secondLargest(new int[]{7, 7, 7})); // edge case: sab same
        System.out.println(secondLargest(new int[]{5, 9})); // edge case: sirf do
    }
}

// Output:
// 34
// -1
// 5
