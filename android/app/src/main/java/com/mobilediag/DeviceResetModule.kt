package com.mobilediag

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.UserHandle
import android.os.UserManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class DeviceResetModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DeviceResetModule"
    }

    @ReactMethod
    fun factoryReset(promise: Promise) {
        try {
            val context: Context = reactApplicationContext
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                val userManager = context.getSystemService(Context.USER_SERVICE) as UserManager
                userManager.requestQuietModeEnabled(UserHandle.SYSTEM, false)
            }
            val intent = Intent(Intent.ACTION_FACTORY_RESET)
            intent.addFlags(Intent.FLAG_RECEIVER_FOREGROUND)
            intent.putExtra(Intent.EXTRA_REASON, "FactoryReset")
            intent.putExtra(Intent.EXTRA_WIPE_EXTERNAL_STORAGE, true)
            intent.putExtra(Intent.EXTRA_WIPE_ESIMS, true)
            context.sendBroadcast(intent)
            promise.resolve("Factory reset initiated")
        } catch (e: Exception) {
            promise.reject("FactoryResetError", e)
        }
    }
}
