import java.util.Arrays;

class Main {
    // Array ka sum: loop har item par ek baar chalta hai -> n items = n steps
    static long sum(int[] arr) {
        long total = 0; // ek baar ka kaam //@init
        for (int x : arr) { // n baar chalega //@loop
            total += x; // har item par ek kaam //@add
        }
        return total; // ek baar ka kaam //@done
    }

    public static void main(String[] args) {
        System.out.println(sum(new int[]{4, 1, 3, 2})); // 4 items -> loop 4 baar
        int[] big = new int[1_000_000];
        Arrays.fill(big, 1);
        System.out.println(sum(big)); // 10 lakh items -> loop 10 lakh baar
    }
}

// Output:
// 10
// 1000000
