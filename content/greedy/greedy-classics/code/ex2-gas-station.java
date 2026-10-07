class Main {
    // Total petrol >= total cost ho to jawab hai. Start dhoondhna: jahan tank minus hua, uske AAGE se dobara
    static int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0; // poore chakkar ka hisaab
        int tank = 0; // abhi ke start se ab tak
        int start = 0;
        for (int i = 0; i < gas.length; i++) {
            int diff = gas[i] - cost[i];
            total += diff;
            tank += diff; //@fill
            if (tank < 0) { // start se i+1 tak nahi pahunche - start..i mein se koi bhi start nahi ho sakta //@reset
                start = i + 1;
                tank = 0;
            }
        }
        return total >= 0 ? start : -1; // total petrol kam - koi start nahi chalega //@done
    }

    public static void main(String[] args) {
        System.out.println(canCompleteCircuit(new int[] {3, 1, 2, 5, 4}, new int[] {4, 2, 3, 1, 3}));
        System.out.println(canCompleteCircuit(new int[] {2, 3, 4}, new int[] {3, 4, 3}));
    }
}

// Output:
// 3
// -1
