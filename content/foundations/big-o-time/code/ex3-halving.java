class Main {
    // n ko baar-baar aadha karo jab tak 1 na bache. Kitne steps?
    static int halvings(int n) {
        int x = n;
        int steps = 0;
        while (x > 1) { // har round mein x aadha ho raha hai //@loop
            x /= 2; //@half
            steps++;
        }
        return steps; //@done
    }

    public static void main(String[] args) {
        System.out.println(halvings(64)); // 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1
        System.out.println(halvings(1_000_000)); // 10 lakh: sirf 19 steps!
        System.out.println(halvings(1_000_000_000)); // 100 crore: sirf 29 steps
    }
}

// Output:
// 6
// 19
// 29
