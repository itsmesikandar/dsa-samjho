class Main {
    static final long MOD = 1_000_000_007L; // bahut questions answer "% (10^9 + 7)" maangte hain

    // n! % MOD: har step par % lagao, taaki number kabhi bahut bada na ho
    static long factMod(int n) {
        long result = 1L; //@init
        for (int i = 2; i <= n; i++) {
            result = (result * i) % MOD; // long mein multiply, phir turant % //@mul
        }
        return result; //@done
    }

    // GALAT tareeka: int mein seedha multiply -> overflow, chupchaap galat answer
    static int factIntWrong(int n) {
        int r = 1;
        for (int i = 2; i <= n; i++) r *= i;
        return r;
    }

    public static void main(String[] args) {
        System.out.println(factMod(13));
        System.out.println(factIntWrong(13)); // galat! asli 13! = 6227020800
        long real = 1L;
        for (int i = 2; i <= 13; i++) real *= i;
        System.out.println(real);
        System.out.println(factMod(20));
    }
}

// Output:
// 227020758
// 1932053504
// 6227020800
// 146326063
