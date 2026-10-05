class Main {
    // x ko dhoondhne mein kitne comparisons lage? (best, worst case samajhne ke liye)
    static int comparisons(int[] arr, int x) {
        int count = 0;
        for (int i = 0; i < arr.length; i++) {
            count++; // ek comparison hua //@cmp
            if (arr[i] == x) return count; // mil gaya, ruk jao //@found
        }
        return count; // poora array dekh liya, nahi mila //@notfound
    }

    public static void main(String[] args) {
        int[] arr = {7, 3, 9, 5, 1};
        System.out.println(comparisons(arr, 5)); // average jaisa case
        System.out.println(comparisons(arr, 7)); // best case: pehla hi item
        System.out.println(comparisons(arr, 8)); // worst case: nahi mila, saare n dekhe
    }
}

// Output:
// 4
// 1
// 5
