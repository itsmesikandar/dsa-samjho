class Main {
    static int findMax(int[] arr) {
        if (arr.length == 0) throw new IllegalArgumentException("Khaali array ka max nahi hota");
        int max = arr[0]; // pehla number hi abhi tak ka sabse bada //@init
        for (int i = 1; i < arr.length; i++) { // baaki sab ko ek-ek karke dekho
            if (arr[i] > max) { // naya champion mila? //@compare
                max = arr[i]; //@update
            }
        }
        return max; //@done
    }

    public static void main(String[] args) {
        System.out.println(findMax(new int[]{3, 8, 2, 9, 4}));
        System.out.println(findMax(new int[]{-5, -2, -9})); // sab negative: max = 0 se shuru karte to galat aata
    }
}

// Output:
// 9
// -2
