class Main {
    // Line mein i-th insaan ko tickets[i] tickets chahiye. Ek baar mein ek ticket (1 second), phir line ke peeche.
    // k-th insaan ko apne saare tickets kab tak mil jaayenge?
    static int timeRequiredToBuy(int[] tickets, int k) {
        int[] t = tickets.clone();
        int time = 0, i = 0;
        while (true) {
            if (t[i] > 0) { // jinke tickets poore ho gaye wo line se bahar - skip
                t[i]--;
                time++; //@buy
                if (i == k && t[i] == 0) return time; //@done
            }
            i = (i + 1) % t.length; // line ka aakhri ke baad wapas pehla: circular //@next
        }
    }

    public static void main(String[] args) {
        System.out.println(timeRequiredToBuy(new int[]{2, 3, 2}, 2));
        System.out.println(timeRequiredToBuy(new int[]{5, 1, 1, 1}, 0));
    }
}

// Output:
// 6
// 8
