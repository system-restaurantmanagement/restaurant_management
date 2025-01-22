import { supabase } from './supabase';

export const getItemOfTheDay = async () => {
  try {
    const { data, error } = await supabase.rpc('get_most_ordered_item');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data[0];
    }
    
    const { data: randomItem, error: randomError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('available', true)
      .limit(1)
      .single();
    
    if (randomError) throw randomError;
    
    return randomItem;
  } catch (error) {
    console.error('Error getting item of the day:', error);
    return null;
  }
};