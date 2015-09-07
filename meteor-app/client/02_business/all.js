/**
 * Created by root on 9/5/15.
 */
bz.help.makeNamespace('bz.buz');
buz = {
  test: function(){
    console.log('test');
  }
}
_.extend(bz.buz, buz);