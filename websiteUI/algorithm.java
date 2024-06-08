import java.util.*;
public class algorithm{
    public static void main(String[] args){
    ArrayList<Integer> hourstilltest = new ArrayList<>(), priority = new ArrayList<>();
    ArrayList<Double> score = new ArrayList<>();
    int sum = 0;
    for(int i = 0; i<hourstilltest.size(); i++){
        score.add((double)hourstilltest.get(i)*priority.get(i));
        sum+=(double)score.get(i);
    }
    
    for(int i = 0; i<score.size(); i++){
        score.set(i, (double)(score.get(i)/sum));
    }  
    Collections.sort(score); 
    for(int i = 0; i<score.size(); i++){
        double x = (double)(score.get(i)*hourstilltest.get(i));
        score.set(i, x);
    }  
    for(int i=0;i<score.size()/2;i++){
         double temp = score.get(i);
         score.set(i,score.get(score.size()-i-1));
         score.set(score.size()-i-1, temp);
    }

    }
    
}