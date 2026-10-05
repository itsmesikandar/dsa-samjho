import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        // 1) Array banana: 5 dabbe, sab 0 se bhare
        int[] marks = new int[5];
        // 2) Values ke saath seedha banana
        int[] prices = {40, 10, 70, 20};

        // 3) Index se likhna aur padhna - dono O(1)
        marks[0] = 95;
        marks[3] = 78;
        System.out.println(prices[2]);     // index 2 = teesra item
        System.out.println(marks.length);  // length fixed hai (ye field hai, method nahi)

        // 4) Har element ek baar dekhna (traverse) - O(n)
        int total = 0;
        for (int p : prices) total += p;
        System.out.println(total);

        // index bhi chahiye to normal for loop
        for (int i = 0; i < prices.length; i++) {
            if (prices[i] > 30) System.out.println("index " + i + " par " + prices[i]);
        }

        // 5) Poora array print: Arrays.toString(), warna [I@1b6d3586 jaisa kuch aayega
        System.out.println(Arrays.toString(marks));
    }
}

// Output:
// 70
// 5
// 140
// index 0 par 40
// index 2 par 70
// [95, 0, 0, 78, 0]
