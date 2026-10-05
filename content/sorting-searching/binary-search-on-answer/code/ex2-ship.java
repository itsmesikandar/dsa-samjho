class Main {
    // Packets ka order fix. Roz ek ship, capacity C. 'days' din mein sab bhejne ke liye sabse kam C?
    static int shipWithinDays(int[] weights, int days) {
        int lo = 0, hi = 0;
        for (int w : weights) {
            lo = Math.max(lo, w); // sabse bhaari packet to jaana hi hai
            hi += w; // ek hi din mein sab //@init
        }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2; //@mid
            if (daysNeeded(weights, mid) <= days) hi = mid; // ye capacity chal gayi: aur kam try karo //@ok
            else lo = mid + 1; //@notok
        }
        return lo; //@done
    }

    // Capacity cap ho to kitne din lagenge? Greedy: aaj jitna aa sake bharo
    static int daysNeeded(int[] w, int cap) {
        int d = 1, load = 0;
        for (int x : w) {
            if (load + x > cap) { // aaj jagah nahi: kal ki ship
                d++;
                load = 0;
            }
            load += x;
        }
        return d;
    }

    public static void main(String[] args) {
        System.out.println(shipWithinDays(new int[]{3, 2, 2, 4, 1, 4}, 3));
        System.out.println(shipWithinDays(new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, 5));
    }
}

// Output:
// 6
// 15
