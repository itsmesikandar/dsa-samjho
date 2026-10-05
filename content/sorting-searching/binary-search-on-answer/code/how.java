class Main {
    // Kele ke dher (piles), h ghante. Speed k = ek ghante mein ek dher se k kele.
    // Sabse kam k jisse h ghante mein sab khatam ho jaayein.
    static int minEatingSpeed(int[] piles, int h) {
        int lo = 1;
        int hi = 0;
        for (int p : piles) hi = Math.max(hi, p); // isse tez khaane ka fayda nahi: har dher 1 ghante mein //@init
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2; //@mid
            if (hoursNeeded(piles, mid) <= h) hi = mid; // mid chal gaya: shayad aur dheere bhi chale //@ok
            else lo = mid + 1; // time zyada laga: tez khaana padega //@notok
        }
        return lo; //@done
    }

    static long hoursNeeded(int[] piles, int k) {
        long hrs = 0;
        for (int p : piles) hrs += (p - 1) / k + 1; // ceil(p / k) bina double ke, bina overflow ke
        return hrs;
    }

    public static void main(String[] args) {
        System.out.println(minEatingSpeed(new int[]{3, 6, 7, 11}, 8));
        System.out.println(minEatingSpeed(new int[]{30, 11, 23, 4, 20}, 5));
    }
}

// Output:
// 4
// 30
