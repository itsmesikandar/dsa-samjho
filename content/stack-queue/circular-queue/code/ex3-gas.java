class Main {
    // Gol raaste par stations: i par gas[i] milta, agle station tak cost[i] lagta. Kahan se shuru karein ki
    // poora chakkar ho jaaye? Na ho to -1. (Answer ho to ek hi hota hai.)
    static int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0; // poore chakkar ka hisaab: < 0 to namumkin
        int tank = 0; // abhi wale start se ab tak tank
        int start = 0;
        for (int i = 0; i < gas.length; i++) {
            int diff = gas[i] - cost[i];
            total += diff;
            tank += diff; //@drive
            if (tank < 0) { // start..i mein se kahin se bhi shuru karo, i ke baad nahi pahunchoge: i + 1 try karo //@reset
                start = i + 1;
                tank = 0;
            }
        }
        return total >= 0 ? start : -1; // total theek hai to bacha hua start ghoom ke bhi pahunchega //@answer
    }

    public static void main(String[] args) {
        System.out.println(canCompleteCircuit(new int[]{1, 2, 3, 4, 5}, new int[]{3, 4, 5, 1, 2}));
        System.out.println(canCompleteCircuit(new int[]{2, 3, 4}, new int[]{3, 4, 3}));
    }
}

// Output:
// 3
// -1
